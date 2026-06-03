const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getCategories } = require('../controllers/productController');

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

module.exports = router;
