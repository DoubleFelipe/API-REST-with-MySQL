# API Loja com Node.js e MySQL

API REST refatorada para usar persistencia relacional MySQL com `mysql2/promise`, JWT e prepared statements.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2 com Promises
- JWT
- Swagger

## Configuracao local

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows, copie `.env.example` para `.env` manualmente se o comando acima não estiver disponível.

3. Importe a base MySQL:

```bash
mysql -u root -p loja < database/loja.sql
```

4. Configure o `.env`:

```env
PORT=3000
HOST=0.0.0.0
API_VERSION=2.0.0
JWT_SECRET=segredo

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=loja
DB_CONNECTION_LIMIT=5
DB_CONNECT_TIMEOUT=10000
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA=
```

5. Execute a API:

```bash
npm start
```

## Deploy com Aiven e Render

O projeto já inclui `render.yaml` com o build, start e health check do Render.

### 1. Criar e preparar o MySQL no Aiven

1. Crie um serviço **Aiven for MySQL** e aguarde o estado `Running`.
2. Crie o banco `loja` no console do Aiven ou use o banco padrão do serviço.
3. Na página de conexão, copie o host, a porta, o usuário e a senha; baixe também o certificado CA.
4. Importe o schema e os dados. O banco informado no final do comando precisa existir:

```bash
mysql --host=SEU_HOST \
  --port=SUA_PORTA \
  --user=SEU_USUARIO \
  --password \
  --ssl-ca=ca.pem \
  loja < database/loja.sql
```

Se usar o banco padrão do Aiven, substitua `loja` por `defaultdb` no comando e em `DB_NAME`.

### 2. Criar a aplicação no Render

No Render, crie um Blueprint a partir deste repositório ou um **Web Service** com:

- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/health`

Configure as variáveis abaixo com os dados do Aiven:

```env
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=loja
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA=<conteudo completo do certificado CA>
JWT_SECRET=<segredo longo e aleatorio>
PUBLIC_URL=https://seu-servico.onrender.com
```

Não defina `PORT` manualmente: o Render fornece essa variável. O servidor usa `0.0.0.0` e a porta recebida do ambiente. O certificado CA não deve ser commitado no repositório.

Após o deploy, valide `https://seu-servico.onrender.com/health`, `/api/status` e `/api-docs`.

## Rotas principais

### Status publico

```http
GET /api/status
```

Resposta esperada:

```json
{
  "versao": "2.0.0",
  "status": "online"
}
```

### Login

```http
POST /login
Content-Type: application/json

{
  "nick": "candido",
  "senha": "senha_do_usuario"
}
```

Resposta:

```json
{
  "token": "...",
  "usuario": {
    "id_usuario": 1,
    "nome": "Candido de Moura",
    "nick": "candido"
  }
}
```

### Rotas privadas

Todas as rotas privadas exigem:

- `Authorization: Bearer <token>`
- `x-user-id: <id_usuario_do_token>`

Sem token a API retorna `401`. Com token, mas sem ID explicito do usuario, retorna `403`.

CRUDs disponiveis:

```http
GET    /api/categorias
GET    /api/categorias/:id
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id

GET    /api/produtos
GET    /api/produtos/:id
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id

GET    /api/clientes
GET    /api/clientes/:id
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id

GET    /api/pedidos
GET    /api/pedidos/:id
POST   /api/pedidos
PUT    /api/pedidos/:id
DELETE /api/pedidos/:id
```

Exemplo para criar categoria:

```http
POST /api/categorias
Authorization: Bearer <token>
x-user-id: 1
Content-Type: application/json

{
  "nome": "Perifericos"
}
```

## Swagger

A documentacao fica em:

```http
GET /api-docs
```

#### Deletar evento
```http
DELETE /events/:id
Authorization: Bearer <token>
```

## Estrutura do Projeto

```
src/
├── app.js              # Configuração principal do Express
├── controllers/
│   ├── authController.js    # Lógica de autenticação
│   └── eventController.js   # Lógica de eventos
├── middlewares/
│   └── auth.js              # Middleware de autenticação JWT
├── models/
│   ├── Events.js            # Modelo de Evento
│   └── User.js               # Modelo de Usuário
├── routes/
    └── routes.js             # Definição das rotas


## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com Nodemon)


## Contato

Felipe - [GitHub](https://github.com/DoubleFelipe)

Link do projeto: [https://github.com/DoubleFelipe/-Desenvolvimento-de-API-REST-Escal-vel-com-Node.js-e-MongoDB1](https://github.com/DoubleFelipe/-Desenvolvimento-de-API-REST-Escal-vel-com-Node.js-e-MongoDB1)  
