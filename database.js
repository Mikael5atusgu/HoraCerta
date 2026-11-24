const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const databaseFile = path.resolve(process.env.DATABASE_FILE || './data/horacerta.sqlite');
fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

const db = new sqlite3.Database(databaseFile);
let transactionQueue = Promise.resolve();

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) return reject(error);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) return reject(error);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) return reject(error);
      resolve(rows);
    });
  });
}

function withTransaction(callback) {
  const transaction = transactionQueue.then(async () => {
    await run('BEGIN IMMEDIATE');
    try {
      const result = await callback({ run, get, all });
      await run('COMMIT');
      return result;
    } catch (error) {
      await run('ROLLBACK');
      throw error;
    }
  });
  transactionQueue = transaction.catch(() => {});
  return transaction;
}

async function seedDemoData() {
  const shouldSeed = process.env.SEED_DEMO_USERS === 'true'
    || (process.env.NODE_ENV === 'production' && Boolean(process.env.BOOTSTRAP_ADMIN_EMAIL && process.env.BOOTSTRAP_ADMIN_PASSWORD))
    || (process.env.NODE_ENV !== 'production' && process.env.SEED_DEMO_USERS !== 'false');
  if (!shouldSeed || await get('SELECT id FROM perfis LIMIT 1')) return;

  const demoUsers = process.env.NODE_ENV === 'production'
    ? [{
      nome: 'Administrador',
      email: process.env.BOOTSTRAP_ADMIN_EMAIL,
      papel: 'admin',
      senha: process.env.BOOTSTRAP_ADMIN_PASSWORD
    }]
    : [
    { nome: 'Administrador Geral', email: 'admin@escola.edu.br', papel: 'admin' },
    { nome: 'Coordenadora Maria', email: 'gestor@escola.edu.br', papel: 'gestor' },
    { nome: 'Carlos Silva', email: 'professor.carlos@escola.edu.br', papel: 'professor', turma: '2º Ano A' },
    { nome: 'Ana Paula', email: 'professora.ana@escola.edu.br', papel: 'professor', turma: '3º Ano B' },
    { nome: 'Joao Pereira', email: 'aluno.joao@escola.edu.br', papel: 'aluno', turma: '2º Ano A' }
  ];
  if (!demoUsers[0].email || !(demoUsers[0].senha || process.env.NODE_ENV !== 'production')) return;
  if (process.env.NODE_ENV === 'production' && demoUsers[0].senha.length < 12) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD deve ter pelo menos 12 caracteres.');
  }
  for (const user of demoUsers) {
    const passwordHash = await bcrypt.hash(user.senha || demoUsers[0].senha || 'HoraCerta2026!', 12);
    await run(
      'INSERT INTO perfis (id, nome, email, senha_hash, papel, turma) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), user.nome, user.email, passwordHash, user.papel, user.turma || null]
    );
  }

  const teacher = await get("SELECT id FROM perfis WHERE papel = 'professor' ORDER BY email LIMIT 1");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dates = [
    { day: 3, hour: 7, minute: 30, title: 'Aula de Matemática', type: 'aula', subject: 'Matemática' },
    { day: 8, hour: 7, minute: 30, title: 'Prova de Matemática', type: 'prova', subject: 'Matemática' },
    { day: 13, hour: 8, minute: 0, title: 'Feira de Ciências', type: 'atividade', subject: 'Multidisciplinar' },
    { day: 20, hour: 0, minute: 0, title: 'Feriado Municipal', type: 'feriado', subject: '' },
    { day: 25, hour: 9, minute: 30, title: 'Aula Vaga - História', type: 'aula', subject: 'História', vaga: true }
  ];

  for (const event of dates) {
    const start = new Date(year, month, event.day, event.hour, event.minute);
    const end = new Date(start.getTime() + (event.type === 'feriado' ? 24 * 60 : 100) * 60_000);
    await run(
      `INSERT INTO eventos
        (id, titulo, tipo, data_inicio, data_fim, disciplina, turma, professor_id, criado_por, vaga)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(), event.title, event.type, start.toISOString(), end.toISOString(),
        event.subject, '2º Ano A', teacher.id, teacher.id, event.vaga ? 1 : 0
      ]
    );
  }
  await run(
    'INSERT INTO avisos (id, titulo, mensagem) VALUES (?, ?, ?)',
    [randomUUID(), 'Bem-vindo ao HoraCerta', 'Confira o calendario e os avisos da sua escola.']
  );
}

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await new Promise((resolve, reject) => {
    db.exec(schema, (error) => error ? reject(error) : resolve());
  });
  await seedDemoData();
}

module.exports = {
  all,
  close: () => new Promise((resolve, reject) => db.close((error) => error ? reject(error) : resolve())),
  get,
  initializeDatabase,
  run,
  withTransaction
};
