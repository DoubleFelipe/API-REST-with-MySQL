const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const event = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Registrar novo usuário
 *     description: Cria um novo usuário com nome, email e senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 description: Email único do usuário
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário (será criptografada)
 *                 example: senha123
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos ou faltando campos obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               erro: "Dados inválidos"
 */
router.post('/register', auth.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Login de usuário
 *     description: Autentica um usuário e retorna um token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: senha123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               erro: "Dados inválidos"
 *       401:
 *         description: Senha incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               erro: "Senha inválida"
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               erro: "Usuário não encontrado"
 */
router.post('/login', auth.login);

/**
 * @swagger
 * /events:
 *   post:
 *     tags:
 *       - Eventos
 *     summary: Criar novo evento
 *     description: Cria um novo evento (requer autenticação)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título do evento
 *                 example: Conferência Tech 2026
 *               description:
 *                 type: string
 *                 description: Descrição detalhada do evento
 *                 example: Grande conferência de tecnologia
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do evento
 *                 example: 2026-07-15T10:00:00Z
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de emails dos participantes
 *                 example: ["participant1@example.com", "participant2@example.com"]
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Listar todos os eventos
 *     description: Retorna a lista completa de todos os eventos cadastrados
 *     responses:
 *       200:
 *         description: Lista de eventos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 title: "Conferência Tech 2026"
 *                 description: "Grande conferência de tecnologia"
 *                 date: "2026-07-15T10:00:00Z"
 *                 participants: ["participant1@example.com"]
 *       500:
 *         description: Erro ao recuperar eventos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/events', authMiddleware, event.create);
router.get('/events', event.getAll);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     tags:
 *       - Eventos
 *     summary: Atualizar evento
 *     description: Atualiza um evento existente pelo ID (requer autenticação)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento a ser atualizado
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título do evento
 *                 example: Conferência Tech 2026 - Atualizado
 *               description:
 *                 type: string
 *                 description: Nova descrição
 *                 example: Grande conferência atualizada
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data do evento
 *                 example: 2026-07-20T10:00:00Z
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Nova lista de participantes
 *                 example: ["new@example.com"]
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: ID inválido ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Eventos
 *     summary: Deletar evento
 *     description: Remove um evento pelo ID (requer autenticação)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento a ser deletado
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Deletado
 *       401:
 *         description: Não autorizado - token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/events/:id', authMiddleware, event.update);
router.delete('/events/:id', authMiddleware, event.delete);

module.exports = router;