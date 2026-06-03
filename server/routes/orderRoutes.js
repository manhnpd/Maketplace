const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);                            // public (optionalAuth handled inside)
router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.put('/:id', requireAuth, updateOrderStatus);

module.exports = router;
