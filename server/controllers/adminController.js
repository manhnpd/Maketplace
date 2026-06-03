const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const DesignerApplication = require('../models/DesignerApplication');
const { parsePagination, paginateResponse } = require('../helpers/pagination');
const { mapOrderBrief, mapApplication, mapProduct } = require('../utils/formatters');
const { ORDER_STATUSES } = require('../utils/constants');

// GET /api/admin/stats
const adminGetStats = async (req, res) => {
  const [products, orders, users, applications] = await Promise.all([
    Product.count(),
    Order.findAllForStats(),
    User.count(),
    DesignerApplication.countPending(),
  ]);

  const totalRevenue = (orders.data || []).reduce((sum, o) => sum + (o.total || 0), 0);
  const orderStats = {};
  ORDER_STATUSES.forEach(s => {
    orderStats[s] = (orders.data || []).filter(o => o.status === s).length;
  });

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

  const { data, error, count } = await Order.findAll({ status, from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json(paginateResponse((data || []).map(mapOrderBrief), count, page, limit));
};

// PUT /api/admin/orders/:id
const adminUpdateOrder = async (req, res) => {
  const { status, note } = req.body;
  const updates = {};
  if (status && ORDER_STATUSES.includes(status)) updates.status = status;
  if (note !== undefined) updates.note = note;

  const { data, error } = await Order.updateStatus(req.params.id, updates);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, status: data.status } });
};

// GET /api/admin/designer-applications
const adminGetApplications = async (req, res) => {
  const { status, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await DesignerApplication.findAll({ status, from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json(paginateResponse((data || []).map(mapApplication), count, page, limit));
};

// PUT /api/admin/designer-applications/:id
const adminUpdateApplication = async (req, res) => {
  const { status, adminNote } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status phải là approved hoặc rejected' });
  }

  const updates = { status, reviewed_at: new Date().toISOString() };
  if (adminNote) updates.admin_note = adminNote;

  const { data, error } = await DesignerApplication.update(req.params.id, updates);
  if (error) return res.status(500).json({ success: false, message: error.message });

  // Nếu approve → cập nhật role trong profiles
  if (status === 'approved' && data.email) {
    const { data: profile } = await User.findByEmail(data.email);
    if (profile) {
      await User.updateRole(profile.id, 'designer');
    }
  }

  res.json({ success: true, data: { id: data.id, status: data.status } });
};

// GET /api/admin/products
const adminGetProducts = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await Product.findAllAdmin({ from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json(paginateResponse((data || []).map(mapProduct), count, page, limit));
};

// POST /api/admin/products
const adminCreateProduct = async (req, res) => {
  const { name, categoryId, designerId, type, badge, price, priceDisplay, description, count, format, color, isNew, isFeatured } = req.body;

  if (!name || !type) return res.status(400).json({ success: false, message: 'Thiếu tên hoặc loại sản phẩm' });

  const { data, error } = await Product.create({
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
  });

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

  const { data, error } = await Product.update(req.params.id, updates);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: { id: data.id, name: data.name } });
};

// DELETE /api/admin/products/:id
const adminDeleteProduct = async (req, res) => {
  const { error } = await Product.remove(req.params.id);
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
};

module.exports = {
  adminGetStats, adminGetOrders, adminUpdateOrder,
  adminGetApplications, adminUpdateApplication,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
};
