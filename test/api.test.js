const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const databaseFile = path.join(os.tmpdir(), `horacerta-${process.pid}.sqlite`);
process.env.DATABASE_FILE = databaseFile;
process.env.JWT_SECRET = 'test-secret-with-more-than-thirty-two-characters';
process.env.NODE_ENV = 'test';
process.env.SEED_DEMO_USERS = 'true';

let app;
let database;
let server;
let baseUrl;

before(async () => {
  ({ app } = require('../server'));
  database = require('../database');
  await database.initializeDatabase();
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (database) await database.close();
  for (const suffix of ['', '-shm', '-wal']) {
    if (fs.existsSync(`${databaseFile}${suffix}`)) fs.unlinkSync(`${databaseFile}${suffix}`);
  }
});

async function request(pathname, { token, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${baseUrl}${pathname}`, { ...options, headers });
  return { status: response.status, body: await response.json() };
}

async function login(email, papel) {
  const response = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha: 'HoraCerta2026!', papel })
  });
  assert.equal(response.status, 200);
  return response.body.token;
}

test('login, autorizacao por perfil, eventos, feedback e aprovacao de troca', async () => {
  const invalidMonth = await request('/api/v1/eventos?mes=13&ano=2026');
  assert.equal(invalidMonth.status, 400);
  assert.equal(invalidMonth.body.status, 'error');

  const invalidRole = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@escola.edu.br', senha: 'HoraCerta2026!', papel: 'aluno' })
  });
  assert.equal(invalidRole.status, 401);

  const studentToken = await login('aluno.joao@escola.edu.br', 'aluno');
  const deniedEvent = await request('/api/v1/eventos', {
    method: 'POST',
    token: studentToken,
    body: JSON.stringify({ titulo: 'Evento bloqueado', tipo: 'prova', data_inicio: new Date().toISOString(), data_fim: new Date(Date.now() + 3600000).toISOString() })
  });
  assert.equal(deniedEvent.status, 403);
  assert.equal(deniedEvent.body.status, 'error');

  const feedback = await request('/api/v1/feedbacks', {
    method: 'POST',
    token: studentToken,
    body: JSON.stringify({ tipo: 'sugestao', mensagem: 'Adicionar mais detalhes no calendario.' })
  });
  assert.equal(feedback.status, 201);

  const professorToken = await login('professor.carlos@escola.edu.br', 'professor');
  const listedEvents = await request('/api/v1/eventos', { token: professorToken });
  assert.equal(listedEvents.status, 200);
  const vacancy = listedEvents.body.data.find((event) => event.vaga);
  assert.ok(vacancy, 'the seeded calendar should contain a vacant class');

  const createdEvent = await request('/api/v1/eventos', {
    method: 'POST',
    token: professorToken,
    body: JSON.stringify({
      titulo: 'Trabalho de Ciências',
      tipo: 'trabalho',
      data_inicio: new Date(Date.now() + 86400000).toISOString(),
      data_fim: new Date(Date.now() + 90000000).toISOString(),
      disciplina: 'Ciências',
      turma: '2º Ano A'
    })
  });
  assert.equal(createdEvent.status, 201);
  assert.equal(createdEvent.body.data.turma, '2º Ano A');

  const otherProfessorToken = await login('professora.ana@escola.edu.br', 'professor');
  const forbiddenEdit = await request(`/api/v1/eventos/${createdEvent.body.data.id}`, {
    method: 'PUT',
    token: otherProfessorToken,
    body: JSON.stringify({
      titulo: 'Alteracao indevida',
      tipo: 'trabalho',
      data_inicio: new Date(Date.now() + 86400000).toISOString(),
      data_fim: new Date(Date.now() + 90000000).toISOString(),
      turma: '3º Ano B'
    })
  });
  assert.equal(forbiddenEdit.status, 403);
  const editedEvent = await request(`/api/v1/eventos/${createdEvent.body.data.id}`, {
    method: 'PUT',
    token: professorToken,
    body: JSON.stringify({
      titulo: 'Trabalho de Ciências atualizado',
      tipo: 'trabalho',
      data_inicio: new Date(Date.now() + 86400000).toISOString(),
      data_fim: new Date(Date.now() + 90000000).toISOString(),
      turma: '3º Ano B'
    })
  });
  assert.equal(editedEvent.status, 200);
  assert.equal(editedEvent.body.data.titulo, 'Trabalho de Ciências atualizado');
  assert.equal(editedEvent.body.data.turma, '2º Ano A');

  const swap = await request('/api/v1/trocas', {
    method: 'POST',
    token: professorToken,
    body: JSON.stringify({ evento_id: vacancy.id })
  });
  assert.equal(swap.status, 201);
  const competingSwap = await request('/api/v1/trocas', {
    method: 'POST',
    token: otherProfessorToken,
    body: JSON.stringify({ evento_id: vacancy.id })
  });
  assert.equal(competingSwap.status, 201);
  const duplicateSwap = await request('/api/v1/trocas', {
    method: 'POST',
    token: professorToken,
    body: JSON.stringify({ evento_id: vacancy.id })
  });
  assert.equal(duplicateSwap.status, 409);

  const managerToken = await login('gestor@escola.edu.br', 'gestor');
  const pending = await request('/api/v1/trocas', { token: managerToken });
  assert.equal(pending.status, 200);
  assert.equal(pending.body.data.length, 2);
  const approvedRequest = pending.body.data.find((entry) => entry.professor === 'Carlos Silva');
  const approved = await request(`/api/v1/trocas/${approvedRequest.id}`, {
    method: 'PATCH',
    token: managerToken,
    body: JSON.stringify({ decisao: 'aprovado' })
  });
  assert.equal(approved.status, 200);
  const noLongerPending = await request('/api/v1/trocas', { token: managerToken });
  assert.equal(noLongerPending.body.data.length, 0);
  const refreshed = await request('/api/v1/eventos', { token: studentToken });
  assert.equal(refreshed.body.data.find((event) => event.id === vacancy.id).vaga, 0);

  const adminToken = await login('admin@escola.edu.br', 'admin');
  const newUser = await request('/api/v1/admin/usuarios', {
    method: 'POST',
    token: adminToken,
    body: JSON.stringify({
      nome: 'Novo Professor',
      email: 'novo.professor@escola.edu.br',
      senha: 'SenhaDeTeste2026',
      papel: 'professor',
      turma: '4º Ano A'
    })
  });
  assert.equal(newUser.status, 201);
  const users = await request('/api/v1/admin/usuarios', { token: adminToken });
  assert.equal(users.status, 200);
  assert.equal(users.body.data.length, 6);
  const audit = await request('/api/v1/admin/auditoria', { token: adminToken });
  assert.equal(audit.status, 200);
  assert.ok(audit.body.data.some((entry) => entry.acao === 'CRIACAO_USUARIO'));
});
