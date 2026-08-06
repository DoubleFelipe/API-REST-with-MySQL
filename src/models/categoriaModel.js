const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias ORDER BY id_categoria',
    []
  );

  return rows;
};

exports.findById = async (idCategoria) => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias WHERE id_categoria = ? LIMIT 1',
    [idCategoria]
  );

  return rows[0] || null;
};

exports.create = async ({ nome }) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  );

  return exports.findById(result.insertId);
};

exports.update = async (idCategoria, { nome }) => {
  const [result] = await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, idCategoria]
  );

  if (result.affectedRows === 0) return null;

  return exports.findById(idCategoria);
};

exports.remove = async (idCategoria) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [idCategoria]
  );

  return result.affectedRows > 0;
};
