const supabase = require('../config/supabase');

const Designer = {
  async findAll() {
    return supabase.from('designers').select('*').order('id');
  },

  async findById(id) {
    return supabase
      .from('designers')
      .select('*')
      .eq('id', parseInt(id))
      .single();
  },

  async findByUserId(userId) {
    return supabase
      .from('designers')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async findAllMatching() {
    return supabase.from('designers').select('*');
  },

  async update(id, data) {
    return supabase
      .from('designers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
  },

  async findBySlug(slug) {
    return supabase
      .from('designers')
      .select('id')
      .eq('slug', slug)
      .single();
  },
};

module.exports = Designer;
