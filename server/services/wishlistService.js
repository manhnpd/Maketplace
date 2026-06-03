const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { mapProductBrief } = require('../utils/formatters');

const wishlistService = {
  async getWishlist(userId) {
    const { data: wishData, error } = await Wishlist.findByUser(userId);
    if (error) return { error: error.message };

    const productIds = (wishData || []).map(w => w.product_id);
    let productsMap = {};
    if (productIds.length) {
      const { data: products } = await Product.findByIds(productIds);
      (products || []).forEach(p => { productsMap[p.id] = p; });
    }

    const data = (wishData || []).map(w => ({
      productId: w.product_id,
      addedAt: w.created_at,
      product: productsMap[w.product_id] ? mapProductBrief(productsMap[w.product_id]) : null,
    }));

    return { data };
  },

  async addToWishlist(userId, productId) {
    if (!productId) return { error: 'Thiếu productId', status: 400 };

    const { data, error } = await Wishlist.create(userId, productId);
    if (error) {
      if (error.code === '23505') return { error: 'Sản phẩm đã có trong yêu thích', status: 409 };
      return { error: error.message };
    }
    return { data: { productId: data.product_id } };
  },

  async removeFromWishlist(userId, productId) {
    const { error } = await Wishlist.remove(userId, productId);
    if (error) return { error: error.message };
    return { data: { message: 'Đã xóa khỏi yêu thích' } };
  },
};

module.exports = wishlistService;
