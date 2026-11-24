const jwt = require('jsonwebtoken');

const roles = ['aluno', 'professor', 'gestor', 'admin'];

function authenticateToken(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) return res.status(401).json({ status: 'error', error: 'Autenticacao necessaria.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError') return next(error);
    return res.status(401).json({ status: 'error', error: 'Sessao invalida ou expirada. Entre novamente.' });
  }
}

function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.papel)) {
      return res.status(403).json({ status: 'error', error: 'Seu perfil nao tem permissao para esta acao.' });
    }
    next();
  };
}

module.exports = { allowRoles, authenticateToken, roles };
