const Review = require('../models/Review');
const User = require('../models/User');
const { mapReview } = require('../utils/formatters');

// GET /api/reviews?productId=X
const getReviews = async (req, res) => {
  const { productId } = req.query;
  if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId' });

  const { data, error } = await Review.findByProduct(productId);
  if (error) return res.status(500).json({ success: false, message: error.message });

  // Lấy tên user từ profiles
  const userIds = [...new Set((data || []).map(r => r.user_id))];
  let userNames = {};
  if (userIds.length) {
    const { data: profiles } = await User.findNamesByIds(userIds);
    (profiles || []).forEach(p => { userNames[p.id] = p.name; });
  }

  res.json({ success: true, data: (data || []).map(r => mapReview(r, userNames)) });
};

// POST /api/reviews
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  if (!productId || !rating) {
    return res.status(400).json({ success: false, message: 'Thiếu productId hoặc rating' });
  }

  const { data, error } = await Review.create({
    product_id: parseInt(productId),
    user_id: userId,
    rating: Math.min(5, Math.max(1, parseInt(rating))),
    comment: comment || '',
  });

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      id: data.id, productId: data.product_id, rating: data.rating,
      comment: data.comment, createdAt: data.created_at,
    },
  });
};

module.exports = { getReviews, createReview };
