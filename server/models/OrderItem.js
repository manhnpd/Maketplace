const { supabaseAdmin: db } = require('../config/supabase');

const OrderItem = {
  async createBulk(items) {
    return db.from('order_items').insert(items);
  },

  async findByProductIds(productIds) {
    return db
      .from('order_items')
      .select('order_id, product_id, product_name, quantity, price')
      .in('product_id', productIds);
  },

  async findAll() {
    return db
      .from('order_items')
      .select('quantity, price, product_id');
  },

  async findAllWithOrderId() {
    return db
      .from('order_items')
      .select('quantity, price, product_id, order_id');
  },
};

module.exports = OrderItem;
