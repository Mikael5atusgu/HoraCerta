const { Router } = require('express');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run } = require('../database');

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, senha, papel } = req.body;
    if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
      return res.status(400).json({ status: 'error', error: 'Informe e-mail e senha.' });
    }
    const user = await get(
      'SELECT id, nome, email, senha_hash, papel, turma FROM perfis WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    if (!user || !await bcrypt.compare(senha, user.senha_hash) || (papel && papel !== user.papel)) {
      return res.status(401).json({ status: 'error', error: 'E-mail, senha ou perfil incorretos.' });
    }

    const token = jwt.sign(
      { sub: user.id, nome: user.nome, papel: user.papel, turma: user.turma },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    await run(
      'INSERT INTO trilha_auditoria (id, usuario_id, acao, detalhes) VALUES (?, ?, ?, ?)',
      [randomUUID(), user.id, 'LOGIN', 'Acesso realizado']
    );
    return res.json({
      status: 'success',
      token,
      user: { id: user.id, nome: user.nome, email: user.email, papel: user.papel, turma: user.turma }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
