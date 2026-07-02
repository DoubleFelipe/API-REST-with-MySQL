const produtoModel = require('../models/produtoModel');

exports.listar = async (req, res) => {
  try {
    const produtos = await produtoModel.findAll();
    return res.json(produtos);
  } catch {
    return res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await produtoModel.findById(req.params.id);

    if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });

    return res.json(produto);
  } catch {
    return res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
};

exports.criar = async (req, res) => {
  const { nome, valor, estoque = 1, categorias_id_categoria } = req.body;

  if (!nome || valor === undefined || !categorias_id_categoria) {
    return res.status(400).json({ erro: 'Nome, valor e categoria sao obrigatorios' });
  }

  try {
    const produto = await produtoModel.create({
      nome,
      valor,
      estoque,
      categorias_id_categoria
    });

    return res.status(201).json(produto);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Categoria informada nao existe' });
    }

    return res.status(500).json({ erro: 'Erro ao criar produto' });
  }
};

exports.atualizar = async (req, res) => {
  const { nome, valor, estoque, categorias_id_categoria } = req.body;

  try {
    const produto = await produtoModel.update(req.params.id, {
      nome,
      valor,
      estoque,
      categorias_id_categoria
    });

    if (!produto) return res.status(404).json({ erro: 'Produto nao encontrado' });

    return res.json(produto);
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ erro: 'Categoria informada nao existe' });
    }

    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
};

exports.remover = async (req, res) => {
  try {
    const removido = await produtoModel.remove(req.params.id);

    if (!removido) return res.status(404).json({ erro: 'Produto nao encontrado' });

    return res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ erro: 'Produto possui pedidos vinculados' });
    }

    return res.status(500).json({ erro: 'Erro ao remover produto' });
  }
};
