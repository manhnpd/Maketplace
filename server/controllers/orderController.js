const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { parsePagination, paginateResponse } = require('../helpers/pagination');
const { mapOrder } = require('../utils/formatters');
const { ORDER_STATUSES } = require('../utils/constants');

// POST /api/orders
const createOrder = async (req, res) => {
  const {
    customerName, customerEmail, customerPhone,
    customerAddress, note, paymentMethod, items,
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (họ tên, email, SĐT)' });
  }

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const userId = req.user?.id || null;

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

  if (orderError) return res.status(500).json({ success: false, message: orderError.message });

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await OrderItem.createBulk(orderItems);
  if (itemsError) return res.status(500).json({ success: false, message: itemsError.message });

  res.json({
    success: true,
    data: {
      orderId: order.id, total, status: order.status,
      paymentMethod: order.payment_method, createdAt: order.created_at,
    },
  });
};

// GET /api/orders — user's orders
const getOrders = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await Order.findByUser(req.user.id, { from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json(paginateResponse((data || []).map(mapOrder), count, page, limit));
};

// GET /api/orders/:id — order detail
const getOrderById = async (req, res) => {
  const { data, error } = await Order.findByIdAndUser(req.params.id, req.user.id);
  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

  res.json({ success: true, data: mapOrder(data) });
};

// PUT /api/orders/:id — update status
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
  }

  const { data, error } = await Order.updateStatus(req.params.id, { status });
  if (error) return res.status(500).json({ success: false, message: error.message });
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

  res.json({ success: true, data: { id: data.id, status: data.status } });
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
