const supabase = require('../config/supabase');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

// POST /api/orders
const createOrder = async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    note,
    paymentMethod,
    items,
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (họ tên, email, SĐT)' });
  }

  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Get user_id from auth if available
  const userId = req.user?.id || null;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_address: customerAddress || '',
      note: note || '',
      payment_method: paymentMethod || 'cod',
      status: 'pending',
      total,
    })
    .select()
    .single();

  if (orderError) return res.status(500).json({ success: false, message: orderError.message });

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) return res.status(500).json({ success: false, message: itemsError.message });

  res.json({
    success: true,
    data: {
      orderId: order.id,
      total,
      status: order.status,
      paymentMethod: order.payment_method,
      createdAt: order.created_at,
    },
  });
};

// GET /api/orders — user's orders
const getOrders = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(o => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    customerAddress: o.customer_address,
    note: o.note,
    paymentMethod: o.payment_method,
    status: o.status,
    total: o.total,
    items: (o.order_items || []).map(oi => ({
      id: oi.id,
      productId: oi.product_id,
      productName: oi.product_name,
      quantity: oi.quantity,
      price: oi.price,
    })),
    createdAt: o.created_at,
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// GET /api/orders/:id — order detail
const getOrderById = async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', parseInt(req.params.id))
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

  res.json({
    success: true,
    data: {
      id: data.id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      customerAddress: data.customer_address,
      note: data.note,
      paymentMethod: data.payment_method,
      status: data.status,
      total: data.total,
      items: (data.order_items || []).map(oi => ({
        id: oi.id,
        productId: oi.product_id,
        productName: oi.product_name,
        quantity: oi.quantity,
        price: oi.price,
      })),
      createdAt: data.created_at,
    },
  });
};

// PUT /api/orders/:id — update status (for admin use later, but also available here)
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', parseInt(req.params.id))
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

  res.json({ success: true, data: { id: data.id, status: data.status } });
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
