const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const { all, isConstraintError, withTransaction } = require('../database');
const { allowRoles, authenticateToken } = require('../middlewares/auth');

const router = Router();
router.use(authenticateToken, allowRoles('admin'));

router.get('/usuarios', async (req, res, next) => {
  try {
    const users = await all(
      'SELECT id, nome, email, papel, turma, criado_em FROM perfis ORDER BY nome'
    );
    return res.json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
});

router.post('/usuarios', async (req, res, next) => {
  try {
    const { nome, email, senha, papel, turma } = req.body;
    if (typeof nome !== 'string' || nome.trim().length < 2 || nome.trim().length > 100) {
      return res.status(400).json({ status: 'error', error: 'Informe um nome valido.' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ status: 'error', error: 'Informe um e-mail valido.' });
    }
    if (typeof senha !== 'string' || senha.length < 10) {
      return res.status(400).json({ status: 'error', error: 'A senha deve ter pelo menos 10 caracteres.' });
    }
    if (!['aluno', 'professor', 'gestor', 'admin'].includes(papel)) {
      return res.status(400).json({ status: 'error', error: 'Selecione um perfil valido.' });
    }
    const senhaHash = await bcrypt.hash(senha, 12);
    const id = randomUUID();
    await withTransaction(async (tx) => {
      await tx.run(
        'INSERT INTO perfis (id, nome, email, senha_hash, papel, turma) VALUES (?, ?, ?, ?, ?, ?)',
        [id, nome.trim(), email.trim().toLowerCase(), senhaHash, papel, typeof turma === 'string' ? turma.trim().slice(0, 80) || null : null]
      );
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'CRIACAO_USUARIO', id]
      );
    });
    return res.status(201).json({ status: 'success', message: 'Usuario cadastrado.' });
  } catch (error) {
    if (isConstraintError(error)) return res.status(409).json({ status: 'error', error: 'Este e-mail ja esta cadastrado.' });
    next(error);
  }
});

router.get('/auditoria', async (req, res, next) => {
  try {
    const entries = await all(
      `SELECT a.id, a.acao, a.detalhes, a.data_hora, p.nome AS usuario
       FROM trilha_auditoria a LEFT JOIN perfis p ON p.id = a.usuario_id
       ORDER BY a.data_hora DESC LIMIT 100`
    );
    return res.json({ status: 'success', data: entries });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
