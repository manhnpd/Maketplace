const supabase = require('../config/supabase');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id, created_at, products(*)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Map products inside wishlist
  const result = (data || []).map(w => {
    const p = w.products;
    return {
      productId: w.product_id,
      addedAt: w.created_at,
      product: p ? {
        id: p.id,
        name: p.name,
        type: p.type,
        badge: p.badge,
        downloads: p.downloads,
        rating: Number(p.rating),
        price: p.price,
        priceDisplay: p.price_display,
        description: p.description,
        count: p.count,
        format: p.format,
        color: p.color,
        isNew: p.is_new,
        isFeatured: p.is_featured,
      } : null,
    };
  });

  res.json({ success: true, data: result });
};

// POST /api/wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId' });

  const { data, error } = await supabase
    .from('wishlists')
    .insert({ user_id: req.user.id, product_id: parseInt(productId) })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Sản phẩm đã có trong yêu thích' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }

  res.json({ success: true, data: { productId: data.product_id } });
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', req.user.id)
    .eq('product_id', parseInt(req.params.productId));

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, message: 'Đã xóa khỏi yêu thích' });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
