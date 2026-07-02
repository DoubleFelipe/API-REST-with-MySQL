const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes ORDER BY id_cliente',
    []
  );

  return rows;
};

exports.findById = async (idCliente) => {
  const [rows] = await pool.execute(
    'SELECT id_cliente, nome, telefone, status FROM clientes WHERE id_cliente = ? LIMIT 1',
    [idCliente]
  );

  return rows[0] || null;
};

exports.create = async ({ nome, telefone, status = 'medio' }) => {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status]
  );

  return exports.findById(result.insertId);
};

exports.update = async (idCliente, { nome, telefone, status }) => {
  const [result] = await pool.execute(
    'UPDATE clientes SET nome = COALESCE(?, nome), telefone = COALESCE(?, telefone), status = COALESCE(?, status) WHERE id_cliente = ?',
    [nome || null, telefone || null, status || null, idCliente]
  );

  if (result.affectedRows === 0) return null;

  return exports.findById(idCliente);
};

exports.remove = async (idCliente) => {
  const [result] = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [idCliente]
  );

  return result.affectedRows > 0;
};
