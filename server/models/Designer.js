const { supabaseAdmin: db } = require('../config/supabase');

const Designer = {
  async findAll() {
    return db.from('designers').select('*').order('id');
  },

  async findById(id) {
    return db
      .from('designers')
      .select('*')
      .eq('id', parseInt(id))
      .single();
  },

  async findByUserId(userId) {
    return db
      .from('designers')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async findAllMatching() {
    return db.from('designers').select('*');
  },

  async update(id, data) {
    return db
      .from('designers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
  },

  async findBySlug(slug) {
    return db
      .from('designers')
      .select('id')
      .eq('slug', slug)
      .single();
  },
};

module.exports = Designer;
