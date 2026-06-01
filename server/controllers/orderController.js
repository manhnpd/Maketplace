const supabase = require('../config/supabase');

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

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
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

module.exports = { createOrder };
