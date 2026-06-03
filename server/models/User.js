const { supabaseAdmin: db } = require('../config/supabase');

const User = {
  async findById(id) {
    return db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(data) {
    return db.from('profiles').insert(data);
  },

  async findByName(userId) {
    return db
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();
  },

  async findByEmail(email) {
    return db
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
  },

  async updateName(id, name) {
    return db
      .from('profiles')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
  },

  async updateRole(id, role) {
    return db
      .from('profiles')
      .update({ role })
      .eq('id', id);
  },

  async findNamesByIds(ids) {
    return db
      .from('profiles')
      .select('id, name')
      .in('id', ids);
  },

  async count() {
    return db.from('profiles').select('id', { count: 'exact', head: true });
  },
};

module.exports = User;
