const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { mapOrder } = require('../utils/formatters');
const { ORDER_STATUSES } = require('../utils/constants');

const orderService = {
  async createOrder(body, userId) {
    const { customerName, customerEmail, customerPhone, customerAddress, note, paymentMethod, items } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return { error: 'Thiếu thông tin bắt buộc (họ tên, email, SĐT)', status: 400 };
    }
    if (!items || !items.length) {
      return { error: 'Giỏ hàng trống', status: 400 };
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await Order.create({
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_address: customerAddress || '',
      note: note || '',
      payment_method: paymentMethod || 'cod',
      status: 'pending',
      total,
    });
    if (orderError) return { error: orderError.message };

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await OrderItem.createBulk(orderItems);
    if (itemsError) return { error: itemsError.message };

    return {
      data: {
        orderId: order.id, total, status: order.status,
        paymentMethod: order.payment_method, createdAt: order.created_at,
      },
    };
  },

  async getOrders(userId, { from, to }) {
    const { data, error, count } = await Order.findByUser(userId, { from, to });
    if (error) return { error: error.message };
    return { data: (data || []).map(mapOrder), count };
  },

  async getOrderById(id, userId) {
    const { data, error } = await Order.findByIdAndUser(id, userId);
    if (error || !data) return { error: 'Không tìm thấy đơn hàng', status: 404 };
    return { data: mapOrder(data) };
  },

  async updateOrderStatus(id, { status }) {
    if (!ORDER_STATUSES.includes(status)) {
      return { error: 'Trạng thái không hợp lệ', status: 400 };
    }
    const { data, error } = await Order.updateStatus(id, { status });
    if (error) return { error: error.message };
    if (!data) return { error: 'Không tìm thấy đơn hàng', status: 404 };
    return { data: { id: data.id, status: data.status } };
  },
};

module.exports = orderService;
