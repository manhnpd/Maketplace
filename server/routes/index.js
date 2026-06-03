const express = require('express');
const router = express.Router();

const { requireAuth, requireAdmin, requireDesigner } = require('../middleware/auth');

// Sub-routers
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');
const siteRoutes = require('./siteRoutes');
const profileRoutes = require('./profileRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const designerApplicationRoutes = require('./designerApplicationRoutes');
const adminRoutes = require('./adminRoutes');
const designerRoutes = require('./designerRoutes');

// Mount routes
router.use(productRoutes);
router.use('/auth', authRoutes);
router.use(siteRoutes);
router.use('/profile', requireAuth, profileRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', requireAuth, wishlistRoutes);
router.use('/designer-applications', designerApplicationRoutes);
router.use('/admin', requireAdmin, adminRoutes);
router.use('/designer', requireDesigner, designerRoutes);

module.exports = router;
