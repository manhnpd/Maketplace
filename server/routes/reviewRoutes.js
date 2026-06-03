const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getReviews, createReview } = require('../controllers/reviewController');

router.get('/', getReviews);
router.post('/', requireAuth, createReview);

module.exports = router;
