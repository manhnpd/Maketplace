const supabase = require('../config/supabase');

// GET /api/reviews?productId=X
const getReviews = async (req, res) => {
  const { productId } = req.query;
  if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId' });

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(name)')
    .eq('product_id', parseInt(productId))
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(r => ({
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    userName: r.profiles?.name || 'Ẩn danh',
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }));

  res.json({ success: true, data: result });
};

// POST /api/reviews
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  if (!productId || !rating) {
    return res.status(400).json({ success: false, message: 'Thiếu productId hoặc rating' });
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: parseInt(productId),
      user_id: userId,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      comment: comment || '',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      id: data.id,
      productId: data.product_id,
      rating: data.rating,
      comment: data.comment,
      createdAt: data.created_at,
    },
  });
};

module.exports = { getReviews, createReview };
