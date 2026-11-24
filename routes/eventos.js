const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const { all, get, run, withTransaction } = require('../database');
const { allowRoles, authenticateToken } = require('../middlewares/auth');

const router = Router();
const eventTypes = ['aula', 'prova', 'trabalho', 'feriado', 'atividade'];

function validateEvent(body) {
  const { titulo, tipo, data_inicio: start, data_fim: end } = body;
  if (typeof titulo !== 'string' || titulo.trim().length < 2 || titulo.trim().length > 150) return 'Informe um titulo de 2 a 150 caracteres.';
  if (!eventTypes.includes(tipo)) return 'Selecione uma categoria valida.';
  if (!start || !end || !Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(end) <= Date.parse(start)) {
    return 'Informe datas validas; o horario final deve ser posterior ao inicial.';
  }
  return null;
}

function cleanText(value, maxLength = 150) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

router.get('/', async (req, res, next) => {
  try {
    if (req.query.inicio !== undefined || req.query.fim !== undefined) {
      const start = Date.parse(req.query.inicio);
      const end = Date.parse(req.query.fim);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return res.status(400).json({ status: 'error', error: 'Informe um intervalo de datas valido.' });
      }
      const events = await all(
        `SELECT e.*, p.nome AS professor_nome
         FROM eventos e LEFT JOIN perfis p ON p.id = e.professor_id
         WHERE e.data_inicio < ? AND e.data_fim >= ? ORDER BY e.data_inicio`,
        [new Date(end).toISOString(), new Date(start).toISOString()]
      );
      const avisos = await all(
        'SELECT a.id, a.titulo, a.mensagem, a.criado_em, p.nome AS autor FROM avisos a LEFT JOIN perfis p ON p.id = a.criado_por ORDER BY a.criado_em DESC LIMIT 10'
      );
      return res.json({ status: 'success', total: events.length, data: events, avisos });
    }
    const month = Number(req.query.mes);
    const year = Number(req.query.ano);
    const hasMonthFilter = req.query.mes !== undefined || req.query.ano !== undefined;
    if (hasMonthFilter && !(Number.isInteger(month) && month >= 1 && month <= 12 && Number.isInteger(year))) {
      return res.status(400).json({ status: 'error', error: 'Informe mes e ano validos.' });
    }
    const from = hasMonthFilter
      ? new Date(Date.UTC(year, month - 1, 1)).toISOString()
      : null;
    const until = from ? new Date(Date.UTC(year, month, 1)).toISOString() : null;
    const events = from
      ? await all(
        `SELECT e.*, p.nome AS professor_nome
         FROM eventos e LEFT JOIN perfis p ON p.id = e.professor_id
         WHERE e.data_inicio < ? AND e.data_fim >= ? ORDER BY e.data_inicio`,
        [until, from]
      )
      : await all(
        `SELECT e.*, p.nome AS professor_nome
         FROM eventos e LEFT JOIN perfis p ON p.id = e.professor_id ORDER BY e.data_inicio`
      );
    const avisos = await all(
      'SELECT a.id, a.titulo, a.mensagem, a.criado_em, p.nome AS autor FROM avisos a LEFT JOIN perfis p ON p.id = a.criado_por ORDER BY a.criado_em DESC LIMIT 10'
    );
    return res.json({ status: 'success', total: events.length, data: events, avisos });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, allowRoles('professor', 'gestor', 'admin'), async (req, res, next) => {
  try {
    const error = validateEvent(req.body);
    if (error) return res.status(400).json({ status: 'error', error });
    if (req.user.papel === 'professor' && !req.user.turma) {
      return res.status(403).json({ status: 'error', error: 'Seu perfil ainda nao tem uma turma atribuida.' });
    }
    const id = randomUUID();
    const isManager = ['gestor', 'admin'].includes(req.user.papel);
    const professorId = isManager && req.body.professor_id
      ? cleanText(req.body.professor_id, 64)
      : (req.user.papel === 'professor' ? req.user.sub : null);
    const turma = req.user.papel === 'professor' ? req.user.turma : cleanText(req.body.turma, 80);
    await withTransaction(async (tx) => {
      await tx.run(
        `INSERT INTO eventos
          (id, titulo, descricao, tipo, data_inicio, data_fim, disciplina, turma, professor_id, criado_por, vaga)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, req.body.titulo.trim(), cleanText(req.body.descricao, 1000), req.body.tipo,
          new Date(req.body.data_inicio).toISOString(), new Date(req.body.data_fim).toISOString(),
          cleanText(req.body.disciplina, 80), turma, professorId,
          req.user.sub, req.body.vaga ? 1 : 0
        ]
      );
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'CRIACAO_EVENTO', id]
      );
    });
    const event = await get('SELECT * FROM eventos WHERE id = ?', [id]);
    return res.status(201).json({ status: 'success', data: event });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, allowRoles('professor', 'gestor', 'admin'), async (req, res, next) => {
  try {
    const error = validateEvent(req.body);
    if (error) return res.status(400).json({ status: 'error', error });
    const existing = await get('SELECT id, professor_id, criado_por FROM eventos WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ status: 'error', error: 'Evento nao encontrado.' });
    if (req.user.papel === 'professor'
      && (existing.criado_por !== req.user.sub || !req.user.turma)) {
      return res.status(403).json({ status: 'error', error: 'Professores so podem editar eventos que cadastraram.' });
    }

    await withTransaction(async (tx) => {
      await tx.run(
        `UPDATE eventos SET titulo = ?, descricao = ?, tipo = ?, data_inicio = ?, data_fim = ?,
          disciplina = ?, turma = ? WHERE id = ?`,
        [
          req.body.titulo.trim(), cleanText(req.body.descricao, 1000), req.body.tipo,
          new Date(req.body.data_inicio).toISOString(), new Date(req.body.data_fim).toISOString(),
          cleanText(req.body.disciplina, 80),
          req.user.papel === 'professor' ? req.user.turma : cleanText(req.body.turma, 80),
          req.params.id
        ]
      );
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'EDICAO_EVENTO', req.params.id]
      );
    });
    const event = await get('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
    return res.json({ status: 'success', data: event });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, allowRoles('gestor', 'admin'), async (req, res, next) => {
  try {
    const event = await get('SELECT id, titulo FROM eventos WHERE id = ?', [req.params.id]);
    if (!event) return res.status(404).json({ status: 'error', error: 'Evento nao encontrado.' });
    await withTransaction(async (tx) => {
      await tx.run('DELETE FROM eventos WHERE id = ?', [req.params.id]);
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'EXCLUSAO_EVENTO', event.titulo]
      );
    });
    return res.json({ status: 'success', message: 'Evento removido.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
