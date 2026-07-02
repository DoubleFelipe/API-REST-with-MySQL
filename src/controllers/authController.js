const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const md5 = (value) => crypto.createHash('md5').update(value).digest('hex');

const validarSenha = async (senhaInformada, senhaBanco) => {
  if (!senhaInformada || !senhaBanco) return false;

  if (senhaBanco.startsWith('$2a$') || senhaBanco.startsWith('$2b$') || senhaBanco.startsWith('$2y$')) {
    return bcrypt.compare(senhaInformada, senhaBanco);
  }

  return md5(senhaInformada) === senhaBanco;
};

exports.register = async (req, res) => {
  const { nome, nick, senha } = req.body;

  if (!nome || !nick || !senha) {
    return res.status(400).json({ erro: 'Dados invalidos' });
  }

  if (nome.length > 45 || nick.length > 15 || senha.length > 90) {
    return res.status(400).json({ erro: 'Nome, nick ou senha excede o tamanho permitido' });
  }

  try {
    const usuario = await usuarioModel.create({
      nome,
      nick,
      senha: md5(senha)
    });

    return res.status(201).json(usuario);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Nick ja cadastrado' });
    }

    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ erro: 'Nome, nick ou senha excede o tamanho permitido' });
    }

    return res.status(500).json({ erro: 'Erro ao cadastrar usuario' });
  }
};

exports.login = async (req, res) => {
  const nick = req.body.nick || req.body.email;
  const senha = req.body.senha || req.body.password;

  if (!nick || !senha) {
    return res.status(400).json({ erro: 'Dados invalidos' });
  }

  try {
    const usuario = await usuarioModel.findByNick(nick);

    if (!usuario) return res.status(404).json({ erro: 'Usuario nao encontrado' });

    const senhaValida = await validarSenha(senha, usuario.senha);

    if (!senhaValida) return res.status(401).json({ erro: 'Senha invalida' });

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nick: usuario.nick
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        nick: usuario.nick
      }
    });
  } catch {
    return res.status(500).json({ erro: 'Erro ao autenticar usuario' });
  }
};
