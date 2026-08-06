const pool = require('../config/database');

exports.findByNick = async (nick) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, nick, senha FROM usuarios WHERE nick = ? LIMIT 1',
    [nick]
  );

  return rows[0] || null;
};

exports.findById = async (idUsuario) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, nick FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [idUsuario]
  );

  return rows[0] || null;
};

exports.create = async ({ nome, nick, senha }) => {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, nick, senha) VALUES (?, ?, ?)',
    [nome, nick, senha]
  );

  return exports.findById(result.insertId);
};
