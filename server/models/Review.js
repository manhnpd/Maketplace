const supabase = require('../config/supabase');

const Review = {
  async findByProduct(productId) {
    return supabase
      .from('reviews')
      .select('*')
      .eq('product_id', parseInt(productId))
      .order('created_at', { ascending: false });
  },

  async create(data) {
    return supabase
      .from('reviews')
      .insert(data)
      .select()
      .single();
  },
};

module.exports = Review;
