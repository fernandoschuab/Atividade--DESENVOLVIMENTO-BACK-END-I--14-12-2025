const express = require('express');
const router = express.Router();
const controller = require('../controller/controllerPrincipal');

// Rota principal - Lista de produtos
router.get('/', controller.index);

// Rota de povoamento
router.get('/povoamento', controller.povoamento);

// Rota de detalhes do produto
router.get('/produto/:id', controller.detalhes);

// Rota de compra
router.get('/comprar/:id', controller.comprar);
router.post('/comprar/:id', controller.finalizarCompra);

// Rota de dashboard
router.get('/dashboard', controller.dashboard);

// Rota de gerenciamento de pedidos
router.get('/pedidos', controller.gerenciarPedidos);

// Rota de atualização de status do pedido
router.get('/pedidos/:id/:status', controller.atualizarStatus);

module.exports = router;
