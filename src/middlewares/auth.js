const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const getExplicitUserId = (req) => {
  const body = req.body || {};
  const query = req.query || {};

  return (
    req.headers['x-user-id'] ||
    query.id_usuario ||
    query.usuario_id ||
    body.id_usuario ||
    body.usuario_id
  );
};

module.exports = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ erro: 'Token nao informado' });

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ erro: 'Token invalido' });
  }

  const tokenUserId = decoded.id_usuario || decoded.id;
  const requestUserId = getExplicitUserId(req);

  if (!tokenUserId) {
    return res.status(401).json({ erro: 'Token sem usuario valido' });
  }

  if (!requestUserId) {
    return res.status(403).json({ erro: 'ID do usuario obrigatorio' });
  }

  if (Number(requestUserId) !== Number(tokenUserId)) {
    return res.status(403).json({ erro: 'ID do usuario nao confere com o token' });
  }

  try {
    const usuario = await usuarioModel.findById(tokenUserId);

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuario do token nao encontrado' });
    }

    req.user = usuario;
    req.userId = usuario.id_usuario;
    return next();
  } catch {
    return res.status(500).json({ erro: 'Erro ao validar usuario no banco de dados' });
  }
};
