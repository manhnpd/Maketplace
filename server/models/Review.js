const { supabaseAdmin: db } = require('../config/supabase');

const Review = {
  async findByProduct(productId) {
    return db
      .from('reviews')
      .select('*')
      .eq('product_id', parseInt(productId))
      .order('created_at', { ascending: false });
  },

  async create(data) {
    if (!data.id) {
      const { data: maxRow } = await db.from('reviews').select('id').order('id', { ascending: false }).limit(1);
      if (maxRow && maxRow.length > 0) data.id = maxRow[0].id + 1;
    }
    return db.from('reviews').insert(data).select().single();
  },
};

module.exports = Review;
