const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id_produto, p.nome, p.valor, p.estoque, p.categorias_id_categoria,
            c.nome AS categoria
       FROM produtos p
       JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
      ORDER BY p.id_produto`,
    []
  );

  return rows;
};

exports.findById = async (idProduto) => {
  const [rows] = await pool.execute(
    `SELECT p.id_produto, p.nome, p.valor, p.estoque, p.categorias_id_categoria,
            c.nome AS categoria
       FROM produtos p
       JOIN categorias c ON c.id_categoria = p.categorias_id_categoria
      WHERE p.id_produto = ?
      LIMIT 1`,
    [idProduto]
  );

  return rows[0] || null;
};

exports.create = async ({ nome, valor, estoque = 1, categorias_id_categoria }) => {
  const [result] = await pool.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque, categorias_id_categoria]
  );

  return exports.findById(result.insertId);
};

exports.update = async (idProduto, { nome, valor, estoque, categorias_id_categoria }) => {
  const [result] = await pool.execute(
    `UPDATE produtos
        SET nome = COALESCE(?, nome),
            valor = COALESCE(?, valor),
            estoque = COALESCE(?, estoque),
            categorias_id_categoria = COALESCE(?, categorias_id_categoria)
      WHERE id_produto = ?`,
    [
      nome || null,
      valor === undefined ? null : valor,
      estoque === undefined ? null : estoque,
      categorias_id_categoria || null,
      idProduto
    ]
  );

  if (result.affectedRows === 0) return null;

  return exports.findById(idProduto);
};

exports.remove = async (idProduto) => {
  const [result] = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
    [idProduto]
  );

  return result.affectedRows > 0;
};
