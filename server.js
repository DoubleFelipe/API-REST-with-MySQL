require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/database');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} recebido. Encerrando servidor...`);

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
