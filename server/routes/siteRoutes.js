const express = require('express');
const router = express.Router();
const { getPricing, getDesigners, getTestimonials, getStats, getDesignerProfile } = require('../controllers/siteController');

router.get('/pricing', getPricing);
router.get('/designers', getDesigners);
router.get('/designers/:id', getDesignerProfile);
router.get('/testimonials', getTestimonials);
router.get('/stats', getStats);

module.exports = router;
