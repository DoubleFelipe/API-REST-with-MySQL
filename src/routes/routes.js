const express = require('express');

const authController = require('../controllers/authController');
const apiRoutes = require('./apiRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const produtosRoutes = require('./produtosRoutes');
const clientesRoutes = require('./clientesRoutes');
const pedidosRoutes = require('./pedidosRoutes');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use('/api', apiRoutes);
router.use('/api/categorias', categoriaRoutes);
router.use('/api/produtos', produtosRoutes);
router.use('/api/clientes', clientesRoutes);
router.use('/api/pedidos', pedidosRoutes);

module.exports = router;
