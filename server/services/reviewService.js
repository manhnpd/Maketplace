const Review = require('../models/Review');
const User = require('../models/User');
const { mapReview } = require('../utils/formatters');

const reviewService = {
  async getReviews(productId) {
    if (!productId) return { error: 'Thiếu productId', status: 400 };

    const { data, error } = await Review.findByProduct(productId);
    if (error) return { error: error.message };

    const userIds = [...new Set((data || []).map(r => r.user_id))];
    let userNames = {};
    if (userIds.length) {
      const { data: profiles } = await User.findNamesByIds(userIds);
      (profiles || []).forEach(p => { userNames[p.id] = p.name; });
    }

    return { data: (data || []).map(r => mapReview(r, userNames)) };
  },

  async createReview(userId, { productId, rating, comment }) {
    if (!productId || !rating) return { error: 'Thiếu productId hoặc rating', status: 400 };

    const { data, error } = await Review.create({
      product_id: parseInt(productId),
      user_id: userId,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      comment: comment || '',
    });
    if (error) return { error: error.message };

    return {
      data: { id: data.id, productId: data.product_id, rating: data.rating, comment: data.comment, createdAt: data.created_at },
    };
  },
};

module.exports = reviewService;
