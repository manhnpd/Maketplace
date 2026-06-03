const { supabaseAdmin: db } = require('../config/supabase');

const Category = {
  async findAll() {
    return db.from('categories').select('*').order('id');
  },

  async findBySlug(slug) {
    return db
      .from('categories')
      .select('id')
      .eq('slug', slug.toLowerCase())
      .single();
  },
};

module.exports = Category;
