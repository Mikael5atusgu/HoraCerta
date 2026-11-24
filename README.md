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
