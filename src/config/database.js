const mysql = require('mysql2/promise');
const fs = require('fs');

const isTrue = (value) => /^(1|true|yes)$/i.test(String(value || ''));
const caFromEnvironment = process.env.DB_SSL_CA
  ? process.env.DB_SSL_CA.replace(/\\n/g, '\n')
  : null;

let ssl;

if (isTrue(process.env.DB_SSL)) {
  ssl = {
    rejectUnauthorized: !/^(0|false|no)$/i.test(
      String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true')
    )
  };

  if (caFromEnvironment) {
    ssl.ca = caFromEnvironment;
  } else if (process.env.DB_SSL_CA_PATH) {
    ssl.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH);
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'loja',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
  queueLimit: 0,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
  charset: 'utf8mb4',
  ...(ssl ? { ssl } : {})
});

module.exports = pool;
