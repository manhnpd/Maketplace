const express = require('express');
const router = express.Router();
const {
  designerGetProducts, designerGetStats, designerCreateProduct,
  designerUpdateProduct, designerDeleteProduct, designerGetOrders,
  designerGetAnalytics, designerUpdateProfile,
} = require('../controllers/designerController');

router.get('/products', designerGetProducts);
router.post('/products', designerCreateProduct);
router.put('/products/:id', designerUpdateProduct);
router.delete('/products/:id', designerDeleteProduct);
router.get('/stats', designerGetStats);
router.get('/orders', designerGetOrders);
router.get('/analytics', designerGetAnalytics);
router.put('/profile', designerUpdateProfile);

module.exports = router;
