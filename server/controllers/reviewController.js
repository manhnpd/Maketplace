const supabase = require('../config/supabase');

// GET /api/reviews?productId=X
const getReviews = async (req, res) => {
  const { productId } = req.query;
  if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId' });

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', parseInt(productId))
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Lấy tên user từ profiles
  const userIds = [...new Set((data || []).map(r => r.user_id))];
  let userNames = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', userIds);
    (profiles || []).forEach(p => { userNames[p.id] = p.name; });
  }

  const result = (data || []).map(r => ({
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    userName: userNames[r.user_id] || 'Ẩn danh',
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
