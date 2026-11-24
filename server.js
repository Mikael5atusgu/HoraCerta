require('dotenv').config();
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const database = require('./database');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET deve ter pelo menos 32 caracteres. Configure o arquivo .env.');
}

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === 'true') app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ status: 'error', error: 'Muitas tentativas. Tente novamente mais tarde.' })
}));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/eventos', require('./routes/eventos'));
app.use('/api/v1/trocas', require('./routes/trocas'));
app.use('/api/v1/feedbacks', require('./routes/feedbacks'));
app.use('/api/v1/avisos', require('./routes/avisos'));
app.use('/api/v1/admin', require('./routes/admin'));

app.use('/api', (req, res) => res.status(404).json({ status: 'error', error: 'Rota da API nao encontrada.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'error', error: 'JSON invalido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ status: 'error', error: 'A requisicao excede o limite permitido.' });
  }
  return res.status(500).json({ status: 'error', error: 'Erro interno. Tente novamente.' });
});

async function start() {
  await database.initializeDatabase();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`HoraCerta disponivel na porta ${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Nao foi possivel iniciar o HoraCerta:', error);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
