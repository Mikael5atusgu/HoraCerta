const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const { withTransaction } = require('../database');
const { allowRoles, authenticateToken } = require('../middlewares/auth');

const router = Router();

router.post('/', authenticateToken, allowRoles('gestor', 'admin'), async (req, res, next) => {
  try {
    const { titulo, mensagem } = req.body;
    if (typeof titulo !== 'string' || titulo.trim().length < 2 || titulo.trim().length > 120
      || typeof mensagem !== 'string' || mensagem.trim().length < 5 || mensagem.trim().length > 1000) {
      return res.status(400).json({ status: 'error', error: 'Informe titulo e mensagem validos.' });
    }
    const id = randomUUID();
    await withTransaction(async (tx) => {
      await tx.run(
        'INSERT INTO avisos (id, titulo, mensagem, criado_por) VALUES (?, ?, ?, ?)',
        [id, titulo.trim(), mensagem.trim(), req.user.sub]
      );
      await tx.run(
        'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
        [randomUUID(), req.user.sub, 'PUBLICACAO_AVISO', id]
      );
    });
    return res.status(201).json({ status: 'success', message: 'Aviso publicado.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
