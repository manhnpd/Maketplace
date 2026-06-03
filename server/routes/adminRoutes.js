const express = require('express');
const router = express.Router();
const {
  adminGetStats, adminGetOrders, adminUpdateOrder,
  adminGetApplications, adminUpdateApplication,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
} = require('../controllers/adminController');

router.get('/stats', adminGetStats);
router.get('/orders', adminGetOrders);
router.put('/orders/:id', adminUpdateOrder);
router.get('/designer-applications', adminGetApplications);
router.put('/designer-applications/:id', adminUpdateApplication);
router.get('/products', adminGetProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

module.exports = router;
