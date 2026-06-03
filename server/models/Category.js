const supabase = require('../config/supabase');

const Category = {
  async findAll() {
    return supabase.from('categories').select('*').order('id');
  },

  async findBySlug(slug) {
    return supabase
      .from('categories')
      .select('id')
      .eq('slug', slug.toLowerCase())
      .single();
  },
};

module.exports = Category;
