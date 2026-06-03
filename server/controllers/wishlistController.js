const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { mapProductBrief } = require('../utils/formatters');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  const { data: wishData, error } = await Wishlist.findByUser(req.user.id);
  if (error) return res.status(500).json({ success: false, message: error.message });

  const productIds = (wishData || []).map(w => w.product_id);
  let productsMap = {};
  if (productIds.length) {
    const { data: products } = await Product.findByIds(productIds);
    (products || []).forEach(p => { productsMap[p.id] = p; });
  }

  const result = (wishData || []).map(w => {
    const p = productsMap[w.product_id];
    return {
      productId: w.product_id,
      addedAt: w.created_at,
      product: p ? mapProductBrief(p) : null,
    };
  });

  res.json({ success: true, data: result });
};

// POST /api/wishlist
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId' });

  const { data, error } = await Wishlist.create(req.user.id, productId);
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
  const { error } = await Wishlist.remove(req.user.id, req.params.productId);
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, message: 'Đã xóa khỏi yêu thích' });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
