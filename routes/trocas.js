const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const { all, get, isConstraintError, withTransaction } = require('../database');
const { allowRoles, authenticateToken } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticateToken, allowRoles('gestor', 'admin'), async (req, res, next) => {
  try {
    const requests = await all(
      `SELECT s.id, s.status, s.criado_em, e.titulo, e.data_inicio, e.disciplina, e.turma,
              p.nome AS professor
       FROM solicitacoes_troca s
       JOIN eventos e ON e.id = s.evento_id
       JOIN perfis p ON p.id = s.professor_solicitante_id
       WHERE s.status = 'pendente' ORDER BY s.criado_em`
    );
    return res.json({ status: 'success', data: requests });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, allowRoles('professor'), async (req, res, next) => {
  try {
    const event = await get('SELECT id, vaga FROM eventos WHERE id = ?', [req.body.evento_id]);
    if (!event || !event.vaga) return res.status(404).json({ status: 'error', error: 'Esta aula vaga nao esta mais disponivel.' });
    const existing = await get(
      "SELECT id FROM solicitacoes_troca WHERE evento_id = ? AND professor_solicitante_id = ? AND status = 'pendente'",
      [event.id, req.user.sub]
    );
    if (existing) return res.status(409).json({ status: 'error', error: 'Voce ja solicitou esta aula.' });

    await withTransaction(async (tx) => {
      await tx.run(
        'INSERT INTO solicitacoes_troca (id, evento_id, professor_solicitante_id) VALUES (?, ?, ?)',
        [randomUUID(), event.id, req.user.sub]
      );
    });
    return res.status(201).json({ status: 'success', message: 'Solicitacao enviada para a coordenacao.' });
  } catch (error) {
    if (isConstraintError(error)) return res.status(409).json({ status: 'error', error: 'Esta solicitacao ja foi enviada.' });
    next(error);
  }
});

router.patch('/:id', authenticateToken, allowRoles('gestor', 'admin'), async (req, res, next) => {
  try {
    const { decisao } = req.body;
    if (!['aprovado', 'recusado'].includes(decisao)) {
      return res.status(400).json({ status: 'error', error: 'A decisao deve ser aprovado ou recusado.' });
    }
    let result;
    await withTransaction(async (tx) => {
      const request = await tx.get(
        `SELECT s.id, s.evento_id, s.status, s.professor_solicitante_id,
                e.titulo, e.vaga
         FROM solicitacoes_troca s JOIN eventos e ON e.id = s.evento_id
         WHERE s.id = ?`,
        [req.params.id]
      );
      if (!request || request.status !== 'pendente') return;
      if (decisao === 'aprovado' && !request.vaga) return;

      await tx.run('UPDATE solicitacoes_troca SET status = ? WHERE id = ?', [decisao, request.id]);
      if (decisao === 'aprovado') {
        await tx.run(
          'UPDATE eventos SET vaga = 0, professor_id = ? WHERE id = ?',
          [request.professor_solicitante_id, request.evento_id]
        );
        const competingRequests = await tx.run(
          "UPDATE solicitacoes_troca SET status = 'recusado' WHERE evento_id = ? AND id != ? AND status = 'pendente'",
          [request.evento_id, request.id]
        );
        if (competingRequests.changes) {
          await tx.run(
            'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
            [randomUUID(), req.user.sub, 'RECUSA_TROCAS_CONCORRENTES', `${request.evento_id}:${competingRequests.changes}`]
          );
        }
        await tx.run(
          'INSERT INTO avisos (id, titulo, mensagem, criado_por) VALUES (?, ?, ?, ?)',
          [randomUUID(), 'Aula vaga preenchida', `${request.titulo}: substituicao aprovada.`, req.user.sub]
        );
      }
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'DECISAO_TROCA', `${request.id}:${decisao}`]
      );
      result = request;
    });

    if (!result) return res.status(404).json({ status: 'error', error: 'Solicitacao pendente nao encontrada.' });
    return res.json({ status: 'success', message: `Solicitacao ${decisao}.` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
