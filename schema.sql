PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS perfis (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  senha_hash TEXT NOT NULL,
  papel TEXT NOT NULL CHECK (papel IN ('aluno', 'professor', 'gestor', 'admin')),
  turma TEXT,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('aula', 'prova', 'trabalho', 'feriado', 'atividade')),
  data_inicio TEXT NOT NULL,
  data_fim TEXT NOT NULL,
  disciplina TEXT,
  turma TEXT,
  professor_id TEXT REFERENCES perfis(id) ON DELETE SET NULL,
  criado_por TEXT REFERENCES perfis(id) ON DELETE SET NULL,
  vaga INTEGER NOT NULL DEFAULT 0 CHECK (vaga IN (0, 1)),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (data_fim > data_inicio)
);

CREATE TABLE IF NOT EXISTS solicitacoes_troca (
  id TEXT PRIMARY KEY,
  evento_id TEXT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  professor_solicitante_id TEXT NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'recusado')),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  aluno_id TEXT REFERENCES perfis(id) ON DELETE SET NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('sugestao', 'problema')),
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avisos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_por TEXT REFERENCES perfis(id) ON DELETE SET NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trilha_auditoria (
  id TEXT PRIMARY KEY,
  usuario_id TEXT REFERENCES perfis(id) ON DELETE SET NULL,
  acao TEXT NOT NULL,
  detalhes TEXT,
  data_hora TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eventos_datas ON eventos(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes_troca(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_troca_pendente_unica
  ON solicitacoes_troca(evento_id, professor_solicitante_id) WHERE status = 'pendente';
