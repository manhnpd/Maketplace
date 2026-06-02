const supabase = require('../config/supabase');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

// Helper: tìm designer_id + designer row từ user đang đăng nhập
async function findDesigner(userId) {
  // Ưu tiên tìm theo user_id (đáng tin cậy hơn)
  const { data: byUser } = await supabase
    .from('designers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (byUser) return byUser;

  // Fallback: match theo tên
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  const { data: designers } = await supabase
    .from('designers')
    .select('*');

  if (!designers || designers.length === 0) return null;

  const normalizedName = profile.name.toLowerCase().trim();
  return designers.find(d => d.name.toLowerCase().trim() === normalizedName) || null;
}

async function findDesignerId(userId) {
  const d = await findDesigner(userId);
  return d?.id || null;
}

// GET /api/designer/products
const designerGetProducts = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);

  if (!designerId) {
    return res.json({ success: true, data: [] });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .eq('designer_id', designerId)
    .order('id');

  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    categoryId: p.category_id,
    category: p.categories?.name || '',
    type: p.type,
    badge: p.badge,
    price: p.price,
    priceDisplay: p.price_display,
    description: p.description || '',
    count: p.count || 0,
    format: p.format || '',
    color: p.color || '#22C55E',
    downloads: p.downloads,
    rating: Number(p.rating),
    isNew: p.is_new,
    isFeatured: p.is_featured,
    createdAt: p.created_at,
  }));

  res.json({ success: true, data: result, total: result.length });
};

// GET /api/designer/stats
const designerGetStats = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);

  if (!designerId) {
    return res.json({
      success: true,
      data: { totalProducts: 0, totalDownloads: 0, totalRevenue: 0, monthlyRevenue: 0 },
    });
  }

  const [productsResult, ordersResult] = await Promise.all([
    supabase.from('products').select('id, downloads, price').eq('designer_id', designerId),
    supabase.from('order_items').select('quantity, price, product_id'),
  ]);

  const totalProducts = (productsResult.data || []).length;
  const totalDownloads = (productsResult.data || []).reduce((s, p) => s + (p.downloads || 0), 0);

  const productIds = new Set((productsResult.data || []).map(p => p.id));
  const totalRevenue = (ordersResult.data || [])
    .filter(oi => productIds.has(oi.product_id))
    .reduce((s, oi) => s + (oi.price * oi.quantity), 0);

  res.json({
    success: true,
    data: {
      totalProducts,
      totalDownloads,
      totalRevenue,
      monthlyRevenue: Math.round(totalRevenue * 0.15),
    },
  });
};

// POST /api/designer/products — tạo sản phẩm mới
const designerCreateProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });
  }

  const { name, categoryId, type, price, description, count, format, color, isNew, isFeatured } = req.body;
  if (!name || !type) {
    return res.status(400).json({ success: false, message: 'Thiếu tên hoặc loại sản phẩm' });
  }

  const finalPrice = type === 'free' ? 0 : (price || 0);

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      category_id: categoryId || null,
      designer_id: designerId,
      type,
      badge: type,
      price: finalPrice,
      price_display: finalPrice === 0 ? 'Miễn phí' : finalPrice.toLocaleString('vi-VN') + '₫',
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

// PUT /api/designer/products/:id — cập nhật sản phẩm
const designerUpdateProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });
  }

  // Check ownership
  const { data: existing } = await supabase
    .from('products')
    .select('designer_id')
    .eq('id', parseInt(req.params.id))
    .single();

  if (!existing) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }
  if (existing.designer_id !== designerId) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa sản phẩm này' });
  }

  const fields = ['name', 'category_id', 'type', 'badge', 'price', 'price_display', 'description', 'count', 'format', 'color', 'is_new', 'is_featured'];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }

  // Auto-fix price_display if type or price changed
  if (updates.type === 'free' || (updates.price === 0 && !updates.type)) {
    updates.price = 0;
    updates.price_display = 'Miễn phí';
  } else if (updates.price && updates.price > 0) {
    updates.price_display = updates.price.toLocaleString('vi-VN') + '₫';
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

// DELETE /api/designer/products/:id — xóa sản phẩm
const designerDeleteProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });
  }

  const { data: existing } = await supabase
    .from('products')
    .select('designer_id')
    .eq('id', parseInt(req.params.id))
    .single();

  if (!existing) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  }
  if (existing.designer_id !== designerId) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa sản phẩm này' });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', parseInt(req.params.id));

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
};

// GET /api/designer/orders — đơn hàng chứa sản phẩm của designer
const designerGetOrders = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.json({ success: true, data: [], total: 0 });
  }

  // Lấy product IDs của designer
  const { data: designerProducts } = await supabase
    .from('products')
    .select('id')
    .eq('designer_id', designerId);

  const productIds = (designerProducts || []).map(p => p.id);
  if (productIds.length === 0) {
    return res.json({ success: true, data: [], total: 0 });
  }

  // Lấy order_items chứa sản phẩm của designer
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('order_id, product_id, product_name, quantity, price')
    .in('product_id', productIds);

  const orderIds = [...new Set((orderItems || []).map(oi => oi.order_id))];
  if (orderIds.length === 0) {
    return res.json({ success: true, data: [], total: 0 });
  }

  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data: orders, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .in('id', orderIds)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) return res.status(500).json({ success: false, message: error.message });

  // Map items theo order
  const itemsByOrder = {};
  (orderItems || []).forEach(oi => {
    if (!itemsByOrder[oi.order_id]) itemsByOrder[oi.order_id] = [];
    itemsByOrder[oi.order_id].push(oi);
  });

  const result = (orders || []).map(o => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    status: o.status,
    paymentMethod: o.payment_method,
    total: o.total,
    createdAt: o.created_at,
    items: (itemsByOrder[o.id] || []).map(oi => ({
      productName: oi.product_name,
      quantity: oi.quantity,
      price: oi.price,
    })),
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// GET /api/designer/analytics — thống kê chi tiết
const designerGetAnalytics = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.json({
      success: true,
      data: { monthlyData: [], topProducts: [], summary: { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 } },
    });
  }

  const [productsResult, orderItemsResult, ordersResult] = await Promise.all([
    supabase.from('products').select('id, name, downloads, price, rating').eq('designer_id', designerId),
    supabase.from('order_items').select('quantity, price, product_id, order_id'),
    supabase.from('orders').select('id, created_at, status'),
  ]);

  const productIds = new Set((productsResult.data || []).map(p => p.id));
  const myOrderItems = (orderItemsResult.data || []).filter(oi => productIds.has(oi.product_id));
  const myOrderIds = new Set(myOrderItems.map(oi => oi.order_id));
  const myOrders = (ordersResult.data || []).filter(o => myOrderIds.has(o.id));

  // Tổng hợp doanh thu theo tháng (12 tháng gần nhất)
  const monthlyMap = {};
  myOrders.forEach(o => {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
    monthlyMap[key].orders++;
  });
  myOrderItems.forEach(oi => {
    // Tìm order để lấy tháng
    const order = myOrders.find(o => o.id === oi.order_id);
    if (order) {
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) monthlyMap[key].revenue += oi.price * oi.quantity;
    }
  });

  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  // Top sản phẩm theo lượt tải
  const topProducts = (productsResult.data || [])
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      downloads: p.downloads || 0,
      revenue: myOrderItems.filter(oi => oi.product_id === p.id).reduce((s, oi) => s + oi.price * oi.quantity, 0),
      rating: Number(p.rating) || 0,
    }));

  const totalRevenue = myOrderItems.reduce((s, oi) => s + oi.price * oi.quantity, 0);

  res.json({
    success: true,
    data: {
      monthlyData,
      topProducts,
      summary: {
        totalOrders: myOrders.length,
        totalRevenue,
        avgOrderValue: myOrders.length ? Math.round(totalRevenue / myOrders.length) : 0,
      },
    },
  });
};

// PUT /api/designer/profile — cập nhật hồ sơ designer
const designerUpdateProfile = async (req, res) => {
  const designer = await findDesigner(req.user.id);
  if (!designer) {
    return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });
  }

  const updates = {};
  const allowed = ['bio', 'portfolio_url', 'social_links', 'specialties', 'slug'];
  const mapping = { bio: 'bio', portfolioUrl: 'portfolio_url', socialLinks: 'social_links', specialties: 'specialties', slug: 'slug' };

  for (const [bodyKey, dbKey] of Object.entries(mapping)) {
    if (req.body[bodyKey] !== undefined) updates[dbKey] = req.body[bodyKey];
  }

  // Check slug unique
  if (updates.slug && updates.slug !== designer.slug) {
    const { data: existing } = await supabase
      .from('designers')
      .select('id')
      .eq('slug', updates.slug)
      .single();
    if (existing && existing.id !== designer.id) {
      return res.status(400).json({ success: false, message: 'Slug đã được sử dụng' });
    }
  }

  const { data, error } = await supabase
    .from('designers')
    .update(updates)
    .eq('id', designer.id)
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      bio: data.bio,
      portfolioUrl: data.portfolio_url,
      socialLinks: data.social_links,
      specialties: data.specialties,
      slug: data.slug,
    },
  });
};

module.exports = {
  designerGetProducts,
  designerGetStats,
  designerCreateProduct,
  designerUpdateProduct,
  designerDeleteProduct,
  designerGetOrders,
  designerGetAnalytics,
  designerUpdateProfile,
};
