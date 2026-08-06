const pedidoModel = require('../models/pedidoModel');

const itensValidos = (itens) => {
  return Array.isArray(itens) && itens.every((item) => {
    return item.produtos_id_produto && item.quantidade !== undefined && item.valor !== undefined;
  });
};

exports.listar = async (req, res) => {
  try {
    const pedidos = await pedidoModel.findAll();
    return res.json(pedidos);
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar pedidos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const pedido = await pedidoModel.findById(req.params.id);

    if (!pedido) return res.status(404).json({ erro: 'Pedido nao encontrado' });

    return res.json(pedido);
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
};

exports.criar = async (req, res) => {
  const { data, clientes_id_cliente, itens = [] } = req.body;

  if (!data || !clientes_id_cliente) {
    return res.status(400).json({ erro: 'Data e cliente sao obrigatorios' });
  }

  if (!itensValidos(itens)) {
    return res.status(400).json({ erro: 'Itens do pedido invalidos' });
  }

  try {
    const pedido = await pedidoModel.create({ data, clientes_id_cliente, itens });
    return res.status(201).json(pedido);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Cliente ou produto informado nao existe' });
    }

    return res.status(500).json({ erro: 'Erro ao criar pedido' });
  }
};

exports.atualizar = async (req, res) => {
  const { data, clientes_id_cliente, itens } = req.body;

  if (itens !== undefined && !itensValidos(itens)) {
    return res.status(400).json({ erro: 'Itens do pedido invalidos' });
  }

  try {
    const pedido = await pedidoModel.update(req.params.id, { data, clientes_id_cliente, itens });

    if (!pedido) return res.status(404).json({ erro: 'Pedido nao encontrado' });

    return res.json(pedido);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Cliente ou produto informado nao existe' });
    }

    return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await pedidoModel.remove(req.params.id);

    if (!removido) return res.status(404).json({ erro: 'Pedido nao encontrado' });

    return res.json({ mensagem: 'Pedido removido com sucesso' });
  } catch {
    return res.status(500).json({ erro: 'Erro ao remover pedido' });
  }
};
