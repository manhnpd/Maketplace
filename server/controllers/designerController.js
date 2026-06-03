const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Designer = require('../models/Designer');
const User = require('../models/User');
const { parsePagination, paginateResponse } = require('../helpers/pagination');
const { mapDesignerProduct } = require('../utils/formatters');

// Helper: tìm designer row từ user đang đăng nhập
async function findDesigner(userId) {
  const { data: byUser } = await Designer.findByUserId(userId);
  if (byUser) return byUser;

  const { data: profile } = await User.findByName(userId);
  if (!profile) return null;

  const { data: designers } = await Designer.findAllMatching();
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
  if (!designerId) return res.json({ success: true, data: [] });

  const { data, error } = await Product.findByDesigner(designerId);
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(mapDesignerProduct);
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
    Product.findStatsByDesigner(designerId),
    OrderItem.findAll(),
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
      totalProducts, totalDownloads, totalRevenue,
      monthlyRevenue: Math.round(totalRevenue * 0.15),
    },
  });
};

// POST /api/designer/products
const designerCreateProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });

  const { name, categoryId, type, price, description, count, format, color, isNew, isFeatured } = req.body;
  if (!name || !type) return res.status(400).json({ success: false, message: 'Thiếu tên hoặc loại sản phẩm' });

  const finalPrice = type === 'free' ? 0 : (price || 0);

  const { data, error } = await Product.create({
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
  });

  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, name: data.name } });
};

// PUT /api/designer/products/:id
const designerUpdateProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });

  const { data: existing } = await Product.findOwnership(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  if (existing.designer_id !== designerId) return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa sản phẩm này' });

  const fields = ['name', 'category_id', 'type', 'badge', 'price', 'price_display', 'description', 'count', 'format', 'color', 'is_new', 'is_featured'];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }

  if (updates.type === 'free' || (updates.price === 0 && !updates.type)) {
    updates.price = 0;
    updates.price_display = 'Miễn phí';
  } else if (updates.price && updates.price > 0) {
    updates.price_display = updates.price.toLocaleString('vi-VN') + '₫';
  }

  const { data, error } = await Product.update(req.params.id, updates);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, name: data.name } });
};

// DELETE /api/designer/products/:id
const designerDeleteProduct = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });

  const { data: existing } = await Product.findOwnership(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
  if (existing.designer_id !== designerId) return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa sản phẩm này' });

  const { error } = await Product.remove(req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
};

// GET /api/designer/orders
const designerGetOrders = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) return res.json({ success: true, data: [], total: 0 });

  const { data: designerProducts } = await Product.findIdsByDesigner(designerId);
  const productIds = (designerProducts || []).map(p => p.id);
  if (productIds.length === 0) return res.json({ success: true, data: [], total: 0 });

  const { data: orderItems } = await OrderItem.findByProductIds(productIds);
  const orderIds = [...new Set((orderItems || []).map(oi => oi.order_id))];
  if (orderIds.length === 0) return res.json({ success: true, data: [], total: 0 });

  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data: orders, error, count } = await Order.findByIds(orderIds, { from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

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
      productName: oi.product_name, quantity: oi.quantity, price: oi.price,
    })),
  }));

  res.json(paginateResponse(result, count, page, limit));
};

// GET /api/designer/analytics
const designerGetAnalytics = async (req, res) => {
  const designerId = await findDesignerId(req.user.id);
  if (!designerId) {
    return res.json({
      success: true,
      data: { monthlyData: [], topProducts: [], summary: { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 } },
    });
  }

  const [productsResult, orderItemsResult, ordersResult] = await Promise.all([
    Product.findAnalyticsByDesigner(designerId),
    OrderItem.findAllWithOrderId(),
    Order.findAllWithDates(),
  ]);

  const productIds = new Set((productsResult.data || []).map(p => p.id));
  const myOrderItems = (orderItemsResult.data || []).filter(oi => productIds.has(oi.product_id));
  const myOrderIds = new Set(myOrderItems.map(oi => oi.order_id));
  const myOrders = (ordersResult.data || []).filter(o => myOrderIds.has(o.id));

  const monthlyMap = {};
  myOrders.forEach(o => {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, revenue: 0, orders: 0 };
    monthlyMap[key].orders++;
  });
  myOrderItems.forEach(oi => {
    const order = myOrders.find(o => o.id === oi.order_id);
    if (order) {
      const d = new Date(order.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) monthlyMap[key].revenue += oi.price * oi.quantity;
    }
  });

  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
  const topProducts = (productsResult.data || [])
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id, name: p.name, downloads: p.downloads || 0,
      revenue: myOrderItems.filter(oi => oi.product_id === p.id).reduce((s, oi) => s + oi.price * oi.quantity, 0),
      rating: Number(p.rating) || 0,
    }));

  const totalRevenue = myOrderItems.reduce((s, oi) => s + oi.price * oi.quantity, 0);

  res.json({
    success: true,
    data: {
      monthlyData, topProducts,
      summary: {
        totalOrders: myOrders.length, totalRevenue,
        avgOrderValue: myOrders.length ? Math.round(totalRevenue / myOrders.length) : 0,
      },
    },
  });
};

// PUT /api/designer/profile
const designerUpdateProfile = async (req, res) => {
  const designer = await findDesigner(req.user.id);
  if (!designer) return res.status(400).json({ success: false, message: 'Không tìm thấy hồ sơ designer' });

  const updates = {};
  const mapping = { bio: 'bio', portfolioUrl: 'portfolio_url', socialLinks: 'social_links', specialties: 'specialties', slug: 'slug' };
  for (const [bodyKey, dbKey] of Object.entries(mapping)) {
    if (req.body[bodyKey] !== undefined) updates[dbKey] = req.body[bodyKey];
  }

  if (updates.slug && updates.slug !== designer.slug) {
    const { data: existing } = await Designer.findBySlug(updates.slug);
    if (existing && existing.id !== designer.id) {
      return res.status(400).json({ success: false, message: 'Slug đã được sử dụng' });
    }
  }

  const { data, error } = await Designer.update(designer.id, updates);
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      id: data.id, name: data.name, bio: data.bio,
      portfolioUrl: data.portfolio_url, socialLinks: data.social_links,
      specialties: data.specialties, slug: data.slug,
    },
  });
};

module.exports = {
  designerGetProducts, designerGetStats, designerCreateProduct,
  designerUpdateProduct, designerDeleteProduct, designerGetOrders,
  designerGetAnalytics, designerUpdateProfile,
};
