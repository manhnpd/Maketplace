const supabase = require('../config/supabase');

const Order = {
  async create(data) {
    return supabase
      .from('orders')
      .insert(data)
      .select()
      .single();
  },

  async findById(id) {
    return supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', parseInt(id))
      .single();
  },

  async findByUser(userId, { from, to }) {
    return supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);
  },

  async findByIdAndUser(id, userId) {
    return supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', parseInt(id))
      .eq('user_id', userId)
      .single();
  },

  async findAll({ status, from, to }) {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)', { count: 'exact' });
    if (status) query = query.eq('status', status);
    query = query.order('created_at', { ascending: false }).range(from, to);
    return query;
  },

  async findByIds(ids, { from, to }) {
    return supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .in('id', ids)
      .order('created_at', { ascending: false })
      .range(from, to);
  },

  async updateStatus(id, data) {
    return supabase
      .from('orders')
      .update(data)
      .eq('id', parseInt(id))
      .select()
      .single();
  },

  // Stats: get all orders with total and status
  async findAllForStats() {
    return supabase.from('orders').select('id, total, status');
  },

  // For designer analytics
  async findAllWithDates() {
    return supabase.from('orders').select('id, created_at, status');
  },
};

module.exports = Order;
