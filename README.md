# API Loja com Node.js e MySQL

API REST refatorada para usar persistencia relacional MySQL com `mysql2/promise`, JWT e prepared statements.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2 com Promises
- JWT
- Swagger

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Importe a base MySQL:

```bash
mysql -u root -p loja < database/loja.sql
```

3. Configure o `.env`:

```env
PORT=3000
API_VERSION=2.0.0
JWT_SECRET=segredo

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=loja
DB_CONNECTION_LIMIT=10
```

4. Execute a API:

```bash
npm start
```

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
