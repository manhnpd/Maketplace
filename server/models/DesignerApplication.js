const { supabaseAdmin: db } = require('../config/supabase');

const DesignerApplication = {
  async create(data) {
    if (!data.id) {
      const { data: maxRow } = await db.from('designer_applications').select('id').order('id', { ascending: false }).limit(1);
      if (maxRow && maxRow.length > 0) data.id = maxRow[0].id + 1;
    }
    return db.from('designer_applications').insert(data).select().single();
  },

  async findAll({ status, from, to }) {
    let query = db
      .from('designer_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    query = query.range(from, to);
    return query;
  },

  async update(id, data) {
    return db
      .from('designer_applications')
      .update(data)
      .eq('id', parseInt(id))
      .select()
      .single();
  },

  async countPending() {
    return db
      .from('designer_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');
  },
};

module.exports = DesignerApplication;
