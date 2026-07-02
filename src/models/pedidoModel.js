const pool = require('../config/database');

exports.findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT p.id_pedido, p.data, p.clientes_id_cliente, c.nome AS cliente
       FROM pedidos p
       JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
      ORDER BY p.id_pedido`,
    []
  );

  return rows;
};

exports.findById = async (idPedido) => {
  const [pedidos] = await pool.execute(
    `SELECT p.id_pedido, p.data, p.clientes_id_cliente, c.nome AS cliente
       FROM pedidos p
       JOIN clientes c ON c.id_cliente = p.clientes_id_cliente
      WHERE p.id_pedido = ?
      LIMIT 1`,
    [idPedido]
  );

  const pedido = pedidos[0];
  if (!pedido) return null;

  const [itens] = await pool.execute(
    `SELECT pp.produtos_id_produto, pr.nome AS produto, pp.quantidade, pp.valor
       FROM produtos_pedidos pp
       JOIN produtos pr ON pr.id_produto = pp.produtos_id_produto
      WHERE pp.pedidos_id_pedido = ?
      ORDER BY pp.produtos_id_produto`,
    [idPedido]
  );

  return { ...pedido, itens };
};

exports.create = async ({ data, clientes_id_cliente, itens = [] }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data, clientes_id_cliente]
    );

    const idPedido = result.insertId;

    for (const item of itens) {
      await connection.execute(
        'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
        [item.produtos_id_produto, idPedido, item.quantidade, item.valor]
      );
    }

    await connection.commit();
    return exports.findById(idPedido);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.update = async (idPedido, { data, clientes_id_cliente, itens }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      'UPDATE pedidos SET data = COALESCE(?, data), clientes_id_cliente = COALESCE(?, clientes_id_cliente) WHERE id_pedido = ?',
      [data || null, clientes_id_cliente || null, idPedido]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    if (Array.isArray(itens)) {
      await connection.execute(
        'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
        [idPedido]
      );

      for (const item of itens) {
        await connection.execute(
          'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
          [item.produtos_id_produto, idPedido, item.quantidade, item.valor]
        );
      }
    }

    await connection.commit();
    return exports.findById(idPedido);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.remove = async (idPedido) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?',
      [idPedido]
    );

    const [result] = await connection.execute(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [idPedido]
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
