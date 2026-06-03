const { supabaseAdmin: db } = require('../config/supabase');

const Wishlist = {
  async findByUser(userId) {
    return db
      .from('wishlists')
      .select('product_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  async create(userId, productId) {
    return db
      .from('wishlists')
      .insert({ user_id: userId, product_id: parseInt(productId) })
      .select()
      .single();
  },

  async remove(userId, productId) {
    return db
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', parseInt(productId));
  },
};

module.exports = Wishlist;
