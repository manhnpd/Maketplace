const supabase = require('../config/supabase');

const User = {
  async findById(id) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(data) {
    return supabase.from('profiles').insert(data);
  },

  async findByName(userId) {
    return supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .single();
  },

  async findByEmail(email) {
    return supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
  },

  async updateName(id, name) {
    return supabase
      .from('profiles')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
  },

  async updateRole(id, role) {
    return supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);
  },

  async findNamesByIds(ids) {
    return supabase
      .from('profiles')
      .select('id, name')
      .in('id', ids);
  },

  async count() {
    return supabase.from('profiles').select('id', { count: 'exact', head: true });
  },
};

module.exports = User;
