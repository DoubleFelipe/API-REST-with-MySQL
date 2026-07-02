const categoriaModel = require('../models/categoriaModel');

exports.listar = async (req, res) => {
  try {
    const categorias = await categoriaModel.findAll();
    return res.json(categorias);
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const categoria = await categoriaModel.findById(req.params.id);

    if (!categoria) return res.status(404).json({ erro: 'Categoria nao encontrada' });

    return res.json(categoria);
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar categoria' });
  }
};

exports.criar = async (req, res) => {
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome e obrigatorio' });

  try {
    const categoria = await categoriaModel.create({ nome });
    return res.status(201).json(categoria);
  } catch {
    return res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
};

exports.atualizar = async (req, res) => {
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ erro: 'Nome e obrigatorio' });

  try {
    const categoria = await categoriaModel.update(req.params.id, { nome });

    if (!categoria) return res.status(404).json({ erro: 'Categoria nao encontrada' });

    return res.json(categoria);
  } catch {
    return res.status(500).json({ erro: 'Erro ao atualizar categoria' });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await categoriaModel.remove(req.params.id);

    if (!removido) return res.status(404).json({ erro: 'Categoria nao encontrada' });

    return res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ erro: 'Categoria possui produtos vinculados' });
    }

    return res.status(500).json({ erro: 'Erro ao remover categoria' });
  }
};
