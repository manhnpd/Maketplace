const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getProducts, getProduct, getCategories } = require('../controllers/productController');
const { register, login } = require('../controllers/authController');
const { getPricing, getDesigners, getTestimonials, getStats } = require('../controllers/siteController');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { createApplication } = require('../controllers/designerApplicationController');
const { createReview, getReviews } = require('../controllers/reviewController');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { adminGetStats, adminGetOrders, adminUpdateOrder, adminGetApplications, adminUpdateApplication, adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } = require('../controllers/adminController');
const { designerGetProducts, designerGetStats } = require('../controllers/designerController');

// Products (public)
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

// Auth (public)
router.post('/auth/register', register);
router.post('/auth/login', login);

// Site (public)
router.get('/pricing', getPricing);
router.get('/designers', getDesigners);
router.get('/testimonials', getTestimonials);
router.get('/stats', getStats);

// Profile (auth required)
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

// Orders
router.post('/orders', createOrder);
router.get('/orders', requireAuth, getOrders);
router.get('/orders/:id', requireAuth, getOrderById);

// Reviews
router.get('/reviews', getReviews);
router.post('/reviews', requireAuth, createReview);

// Wishlist (auth required)
router.get('/wishlist', requireAuth, getWishlist);
router.post('/wishlist', requireAuth, addToWishlist);
router.delete('/wishlist/:productId', requireAuth, removeFromWishlist);

// Designer Applications
router.post('/designer-applications', createApplication);

// Admin (admin only)
router.get('/admin/stats', requireAdmin, adminGetStats);
router.get('/admin/orders', requireAdmin, adminGetOrders);
router.put('/admin/orders/:id', requireAdmin, adminUpdateOrder);
router.get('/admin/designer-applications', requireAdmin, adminGetApplications);
router.put('/admin/designer-applications/:id', requireAdmin, adminUpdateApplication);
router.get('/admin/products', requireAdmin, adminGetProducts);
router.post('/admin/products', requireAdmin, adminCreateProduct);
router.put('/admin/products/:id', requireAdmin, adminUpdateProduct);
router.delete('/admin/products/:id', requireAdmin, adminDeleteProduct);

// Designer (auth required + role=designer)
router.get('/designer/products', requireAuth, designerGetProducts);
router.get('/designer/stats', requireAuth, designerGetStats);

module.exports = router;
