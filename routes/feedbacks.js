const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const { all, run } = require('../database');
const { allowRoles, authenticateToken } = require('../middlewares/auth');

const router = Router();

router.post('/', authenticateToken, allowRoles('aluno'), async (req, res, next) => {
  try {
    const { mensagem, tipo } = req.body;
    if (typeof mensagem !== 'string' || mensagem.trim().length < 5 || mensagem.trim().length > 1000) {
      return res.status(400).json({ status: 'error', error: 'A mensagem deve ter entre 5 e 1000 caracteres.' });
    }
    if (!['problema', 'sugestao'].includes(tipo)) return res.status(400).json({ status: 'error', error: 'Selecione problema ou sugestao.' });
    await run(
      'INSERT INTO feedbacks (id, aluno_id, mensagem, tipo) VALUES (?, ?, ?, ?)',
      [randomUUID(), req.user.sub, mensagem.trim(), tipo]
    );
    return res.status(201).json({ status: 'success', message: 'Feedback enviado. Obrigado!' });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateToken, allowRoles('admin'), async (req, res, next) => {
  try {
    const feedbacks = await all(
      `SELECT f.id, f.tipo, f.mensagem, f.criado_em, p.nome AS aluno
       FROM feedbacks f LEFT JOIN perfis p ON p.id = f.aluno_id ORDER BY f.criado_em DESC`
    );
    return res.json({ status: 'success', data: feedbacks });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
