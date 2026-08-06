const express = require('express');
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.remover);

module.exports = router;
