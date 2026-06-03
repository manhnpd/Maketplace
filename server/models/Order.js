const { supabaseAdmin: db } = require('../config/supabase');

const Order = {
  async create(data) {
    if (!data.id) {
      const { data: maxRow } = await db.from('orders').select('id').order('id', { ascending: false }).limit(1);
      if (maxRow && maxRow.length > 0) data.id = maxRow[0].id + 1;
    }
    return db.from('orders').insert(data).select().single();
  },

  async findById(id) {
    return db
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', parseInt(id))
      .single();
  },

  async findByUser(userId, { from, to }) {
    return db
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);
  },

  async findByIdAndUser(id, userId) {
    return db
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', parseInt(id))
      .eq('user_id', userId)
      .single();
  },

  async findAll({ status, from, to }) {
    let query = db
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' });
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);
    return query;
  },

  async findByIds(ids, { from, to }) {
    return db
      .from('orders')
      .select('*', { count: 'exact' })
      .in('id', ids)
      .order('created_at', { ascending: false })
      .range(from, to);
  },

  async updateStatus(id, data) {
    return db
      .from('orders')
      .update(data)
      .eq('id', parseInt(id))
      .select()
      .single();
  },

  // Stats: get all orders with total and status
  async findAllForStats() {
    return db.from('orders').select('id, total, status');
  },

  // For designer analytics
  async findAllWithDates() {
    return db.from('orders').select('id, created_at, status');
  },
};

module.exports = Order;
