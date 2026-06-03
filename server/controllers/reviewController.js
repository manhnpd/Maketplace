const reviewService = require('../services/reviewService');

const getReviews = async (req, res) => {
  const result = await reviewService.getReviews(req.query.productId);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const createReview = async (req, res) => {
  const result = await reviewService.createReview(req.user.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { getReviews, createReview };
