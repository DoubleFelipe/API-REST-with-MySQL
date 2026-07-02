const clienteModel = require('../models/clienteModel');

const statusValidos = ['bom', 'medio', 'ruim'];

exports.listar = async (req, res) => {
  try {
    const clientes = await clienteModel.findAll();
    return res.json(clientes);
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar clientes' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const cliente = await clienteModel.findById(req.params.id);

    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado' });

    return res.json(cliente);
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

exports.criar = async (req, res) => {
  const { nome, telefone, status = 'medio' } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ erro: 'Nome e telefone sao obrigatorios' });
  }

  if (!statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'Status invalido' });
  }

  try {
    const cliente = await clienteModel.create({ nome, telefone, status });
    return res.status(201).json(cliente);
  } catch {
    return res.status(500).json({ erro: 'Erro ao criar cliente' });
  }
};

exports.atualizar = async (req, res) => {
  const { nome, telefone, status } = req.body;

  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ erro: 'Status invalido' });
  }

  try {
    const cliente = await clienteModel.update(req.params.id, { nome, telefone, status });

    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado' });

    return res.json(cliente);
  } catch {
    return res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await clienteModel.remove(req.params.id);

    if (!removido) return res.status(404).json({ erro: 'Cliente nao encontrado' });

    return res.json({ mensagem: 'Cliente removido com sucesso' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ erro: 'Cliente possui pedidos vinculados' });
    }

    return res.status(500).json({ erro: 'Erro ao remover cliente' });
  }
};
