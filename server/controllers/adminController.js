const supabase = require('../config/supabase');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

// GET /api/admin/stats
const adminGetStats = async (req, res) => {
  const [products, orders, users, applications] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, status'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('designer_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const totalRevenue = (orders.data || []).reduce((sum, o) => sum + (o.total || 0), 0);
  const orderStats = {
    pending: (orders.data || []).filter(o => o.status === 'pending').length,
    processing: (orders.data || []).filter(o => o.status === 'processing').length,
    shipped: (orders.data || []).filter(o => o.status === 'shipped').length,
    delivered: (orders.data || []).filter(o => o.status === 'delivered').length,
    cancelled: (orders.data || []).filter(o => o.status === 'cancelled').length,
  };

  res.json({
    success: true,
    data: {
      totalProducts: products.count || 0,
      totalOrders: (orders.data || []).length,
      totalUsers: users.count || 0,
      totalRevenue,
      pendingApplications: applications.count || 0,
      orderStats,
    },
  });
};

// GET /api/admin/orders
const adminGetOrders = async (req, res) => {
  const { status, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  let query = supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' });

  if (status) query = query.eq('status', status);
  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(o => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    status: o.status,
    total: o.total,
    paymentMethod: o.payment_method,
    itemsCount: (o.order_items || []).length,
    createdAt: o.created_at,
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// PUT /api/admin/orders/:id
const adminUpdateOrder = async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const updates = {};
  if (status && validStatuses.includes(status)) updates.status = status;
  if (note !== undefined) updates.note = note;

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', parseInt(req.params.id))
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, status: data.status } });
};

// GET /api/admin/designer-applications
const adminGetApplications = async (req, res) => {
  const { status, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  let query = supabase.from('designer_applications').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(a => ({
    id: a.id,
    fullName: a.full_name,
    email: a.email,
    phone: a.phone,
    specialties: a.specialties,
    portfolioUrl: a.portfolio_url,
    bio: a.bio,
    status: a.status,
    adminNote: a.admin_note,
    createdAt: a.created_at,
    reviewedAt: a.reviewed_at,
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// PUT /api/admin/designer-applications/:id
const adminUpdateApplication = async (req, res) => {
  const { status, adminNote } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status phải là approved hoặc rejected' });
  }

  const updates = { status, reviewed_at: new Date().toISOString() };
  if (adminNote) updates.admin_note = adminNote;

  const { data, error } = await supabase
    .from('designer_applications')
    .update(updates)
    .eq('id', parseInt(req.params.id))
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Nếu approve → cập nhật role trong profiles (nếu user đã có account)
  if (status === 'approved' && data.email) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', data.email)
      .single();
    if (profile) {
      await supabase.from('profiles').update({ role: 'designer' }).eq('id', profile.id);
    }
  }

  res.json({ success: true, data: { id: data.id, status: data.status } });
};

// GET /api/admin/products
const adminGetProducts = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await supabase
    .from('products')
    .select('*, categories(name), designers(name)', { count: 'exact' })
    .order('id')
    .range(from, to);

  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.categories?.name || '',
    type: p.type,
    badge: p.badge,
    downloads: p.downloads,
    rating: Number(p.rating),
    price: p.price,
    priceDisplay: p.price_display,
    designer: p.designers?.name || '',
    isNew: p.is_new,
    isFeatured: p.is_featured,
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// POST /api/admin/products
const adminCreateProduct = async (req, res) => {
  const { name, categoryId, designerId, type, badge, price, priceDisplay, description, count, format, color, isNew, isFeatured } = req.body;

  if (!name || !type) return res.status(400).json({ success: false, message: 'Thiếu tên hoặc loại sản phẩm' });

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      category_id: categoryId || null,
      designer_id: designerId || null,
      type,
      badge: badge || type,
      price: price || 0,
      price_display: priceDisplay || (price === 0 ? 'Miễn phí' : price.toLocaleString('vi-VN') + '₫'),
      description: description || '',
      count: count || 0,
      format: format || '',
      color: color || '#22C55E',
      is_new: isNew || false,
      is_featured: isFeatured || false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, name: data.name } });
};

// PUT /api/admin/products/:id
const adminUpdateProduct = async (req, res) => {
  const fields = ['name', 'category_id', 'designer_id', 'type', 'badge', 'price', 'price_display', 'description', 'count', 'format', 'color', 'is_new', 'is_featured'];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', parseInt(req.params.id))
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, name: data.name } });
};

// DELETE /api/admin/products/:id
const adminDeleteProduct = async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', parseInt(req.params.id));

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
};

module.exports = {
  adminGetStats, adminGetOrders, adminUpdateOrder,
  adminGetApplications, adminUpdateApplication,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
};
