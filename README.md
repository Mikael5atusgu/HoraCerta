Professor: Carlos David.
Integrantes: Arthur Augusto de Souza, Alexsandro Oliveira Carvalho, Gabriel Carezolin Borges, Luis Fernando Ferreira Maracaipes Campos, Misael Augusto de Oliveira Gomes e Vitor Gabriel da Costa.
HoraCerta --- Gestão Escolar e Calendário de Eventos

Sistema web desenvolvido para centralizar informações escolares, organizar eventos do calendário e facilitar o gerenciamento de aulas, provas, atividades e substituições.
Sobre o projeto

O HoraCerta é uma aplicação web voltada para o ambiente escolar. A proposta é reduzir a desorganização causada por alterações de horários, aulas vagas e falta de comunicação sobre eventos acadêmicos.

O sistema utiliza uma arquitetura full-stack, com frontend em HTML5, CSS3 e JavaScript Vanilla, backend em Node.js com Express e persistência em PostgreSQL ou SQLite.

O projeto é dividido em três módulos principais:

    M01 --- Interface Frontend
    M02 --- Servidor API Backend
    M03 --- Banco de Dados

O escopo também contempla autenticação, calendário com filtros, gestão de eventos e fluxo de solicitação e aprovação de substituições de aulas.
Objetivos

    Centralizar informações acadêmicas em um único sistema.
    Permitir a visualização de eventos escolares em um calendário.
    Facilitar o cadastro e alteração de provas, trabalhos e aulas.
    Permitir solicitações de preenchimento de aulas vagas.
    Permitir que gestores aprovem ou recusem solicitações de substituição.
    Melhorar a comunicação sobre alterações de horários.
    Utilizar controle de acesso baseado em papéis (RBAC).

Perfis de usuário

O sistema possui quatro perfis principais:

Perfil Principais funções

Aluno Visualizar calendário e enviar feedbacks ou relatos de problemas.

Professor Visualizar eventos, cadastrar/alterar eventos de suas turmas e solicitar substituição de aulas vagas.

Gestor Gerenciar eventos, aprovar ou recusar substituições e realizar bloqueios institucionais de horários.
Administrador Possui acesso administrativo completo, incluindo gerenciamento, auditoria e configurações da plataforma.

Também existem serviços auxiliares, como o Banco de Dados e o Serviço Notificador, responsável por alertas e notificações.
Principais funcionalidades
Autenticação

    Login de usuários.
    Controle de acesso por perfil.
    Autenticação utilizando JWT.
    Proteção das rotas conforme as permissões do usuário.

Calendário

    Visualização dos eventos escolares.
    Alternância entre visualização mensal e semanal.
    Filtros por categoria.
    Categorias como:
    Aula
    Prova/Trabalho
    Feriado
    Evento Escolar

Gerenciamento de eventos

Professores, gestores e administradores podem cadastrar eventos acadêmicos, informando:

    Título
    Disciplina
    Turma
    Tipo de evento
    Data
    Horário

Substituição de aulas vagas

O sistema permite:

    Identificar uma aula marcada como vaga.
    Professor solicitar o preenchimento.
    Gestor analisar a solicitação.
    Aprovar ou recusar a substituição.
    Atualizar o calendário após a decisão.
    Notificar os usuários afetados.

Bloqueio institucional

Gestores e administradores podem registrar bloqueios de horários relacionados a atividades institucionais, como eventos em espaços da escola.
Feedback

Alunos podem enviar:

    Sugestões.
    Relatos de problemas relacionados aos horários.

Exclusão segura

Eventos que exigem exclusão administrativa possuem confirmação em duas etapas antes da remoção definitiva.
Arquitetura
# HoraCerta

Calendário escolar responsivo com login por perfil, temas claro/escuro e gestão de eventos, aulas vagas e avisos. A interface segue a referência visual enviada; a API aplica as permissões no servidor e persiste os dados em SQLite.

## Executar localmente

Requisitos: Node.js 22 ou superior.

```powershell
npm install
Copy-Item .env.example .env
npm start
```

Abra `http://localhost:3000`. O banco é criado em `data/horacerta.sqlite` e o esquema é aplicado automaticamente.

### Contas de demonstração

Em desenvolvimento, o primeiro início cria contas para os quatro perfis. Use a senha `HoraCerta2026!`:

| Perfil | E-mail |
|---|---|
| Aluno | `aluno.joao@escola.edu.br` |
| Professor | `professor.carlos@escola.edu.br` |
| Coordenador | `gestor@escola.edu.br` |
| Administrador | `admin@escola.edu.br` |

Essas contas são apenas para desenvolvimento e não são criadas em produção. Para iniciar uma implantação, defina `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` (mínimo de 12 caracteres); o primeiro início cria somente esse administrador. Cadastre os demais usuários pelo perfil Admin.

## Perfis e funcionalidades

- **Aluno:** consulta calendário e envia feedback.
- **Professor:** cria eventos e solicita o preenchimento de aulas vagas.
- **Coordenador:** cria eventos, bloqueia horários, publica avisos e aprova ou recusa solicitações.
- **Administrador:** todas as ações da coordenação, além de cadastro de usuários, consulta de feedbacks e trilha de auditoria.

Todos podem filtrar categorias, alternar entre mês/semana e escolher tema claro ou escuro. A seleção de perfil no login é validada contra a conta; ela não concede permissões por si só.

O seletor de bandeiras no canto superior permite alternar a interface entre português, espanhol e inglês; a preferência fica salva no navegador. A tradução é local: títulos, avisos, comentários e outros conteúdos livres cadastrados por usuários permanecem no idioma original. A biblioteca em `TRADUTOR` usa a API do Google e requer uma chave; ela não é chamada neste modo offline.

## API

- `POST /api/v1/auth/login`
- `GET /api/v1/eventos?mes=8&ano=2026` / `POST /api/v1/eventos`
- `PUT` / `DELETE /api/v1/eventos/:id`
- `POST` / `GET /api/v1/trocas` / `PATCH /api/v1/trocas/:id`
- `POST` / `GET /api/v1/feedbacks`
- `POST /api/v1/avisos`
- `GET` / `POST /api/v1/admin/usuarios`
- `GET /api/v1/admin/auditoria`
- `GET /api/health`

As respostas da API usam JSON com `status` e os campos de resultado ou erro. Rotas protegidas usam `Authorization: Bearer <token>`. JWT expira em 8 horas; senhas são armazenadas com bcrypt e consultas SQL são parametrizadas. Operações de aprovação, cadastro e remoção são transacionais e registram auditoria.

## Versionamento Git

Esta pasta ainda não tem um repositório Git nem histórico de commits. Com o Git instalado, inicialize o repositório e use mensagens no padrão Conventional Commits:

```powershell
git init
git add .
git commit -m "feat: criar aplicacao HoraCerta"
```

Exemplos para próximas alterações: `fix: corrigir filtro semanal`, `docs: atualizar instrucoes de deploy` e `test: cobrir permissao de professor`. O `.gitignore` exclui `.env`, banco local e dependências.

## Publicar pelo GitHub

O repositório inclui uma verificação automatizada em `.github/workflows/ci.yml`. Faça push para o GitHub e o workflow executará `npm ci`, compilará o `better-sqlite3` a partir do código-fonte e executará `npm test`.

GitHub Pages hospeda somente arquivos estáticos e não executa Express nem mantém SQLite. Para publicar a aplicação completa, conecte o repositório a um host Node.js. O arquivo `render.yaml` configura um serviço Render com disco persistente para o SQLite e compila o `better-sqlite3` no próprio ambiente Linux do Render, evitando incompatibilidades de GLIBC. Ao criar o serviço, informe `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` como variáveis secretas. A aplicação usa o valor gerado para `JWT_SECRET`.

## Dados

O esquema versionado está em `schema.sql`. O banco local e as credenciais ficam fora do Git. Para trocar a localização do banco, ajuste `DATABASE_FILE`; em produção, use armazenamento persistente.

### Testes

```powershell
npm test
```
