const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getCategories } = require('../controllers/productController');
const { register, login } = require('../controllers/authController');
const { getPricing, getDesigners, getTestimonials, getStats } = require('../controllers/siteController');
const { createOrder } = require('../controllers/orderController');
const { createApplication } = require('../controllers/designerApplicationController');

// Products
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);

// Site
router.get('/pricing', getPricing);
router.get('/designers', getDesigners);
router.get('/testimonials', getTestimonials);
router.get('/stats', getStats);

// Orders
router.post('/orders', createOrder);

// Designer Applications
router.post('/designer-applications', createApplication);

module.exports = router;
