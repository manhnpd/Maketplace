const supabase = require('../config/supabase');

const DesignerApplication = {
  async create(data) {
    return supabase
      .from('designer_applications')
      .insert(data)
      .select()
      .single();
  },

  async findAll({ status, from, to }) {
    let query = supabase
      .from('designer_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    query = query.range(from, to);
    return query;
  },

  async update(id, data) {
    return supabase
      .from('designer_applications')
      .update(data)
      .eq('id', parseInt(id))
      .select()
      .single();
  },

  async countPending() {
    return supabase
      .from('designer_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
  },
};

module.exports = DesignerApplication;
