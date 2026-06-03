const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const DesignerApplication = require('../models/DesignerApplication');
const { mapOrderBrief, mapApplication, mapProduct } = require('../utils/formatters');
const { ORDER_STATUSES } = require('../utils/constants');

const adminService = {
  async getStats() {
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

    return {
      data: {
        totalProducts: products.count || 0,
        totalOrders: (orders.data || []).length,
        totalUsers: users.count || 0,
        totalRevenue,
        pendingApplications: applications.count || 0,
        orderStats,
      },
    };
  },

  async getOrders({ status, from, to }) {
    const { data, error, count } = await Order.findAll({ status, from, to });
    if (error) return { error: error.message };
    return { data: (data || []).map(mapOrderBrief), count };
  },

  async updateOrder(id, { status, note }) {
    const updates = {};
    if (status && ORDER_STATUSES.includes(status)) updates.status = status;
    if (note !== undefined) updates.note = note;

    const { data, error } = await Order.updateStatus(id, updates);
    if (error) return { error: error.message };
    return { data: { id: data.id, status: data.status } };
  },

  async getApplications({ status, from, to }) {
    const { data, error, count } = await DesignerApplication.findAll({ status, from, to });
    if (error) return { error: error.message };
    return { data: (data || []).map(mapApplication), count };
  },

  async updateApplication(id, { status, adminNote }) {
    if (!['approved', 'rejected'].includes(status)) {
      return { error: 'Status phải là approved hoặc rejected', status: 400 };
    }

    const updates = { status, reviewed_at: new Date().toISOString() };
    if (adminNote) updates.admin_note = adminNote;

    const { data, error } = await DesignerApplication.update(id, updates);
    if (error) return { error: error.message };

    if (status === 'approved' && data.email) {
      const { data: profile } = await User.findByEmail(data.email);
      if (profile) await User.updateRole(profile.id, 'designer');
    }

    return { data: { id: data.id, status: data.status } };
  },

  async getProducts({ from, to }) {
    const { data, error, count } = await Product.findAllAdmin({ from, to });
    if (error) return { error: error.message };
    return { data: (data || []).map(mapProduct), count };
  },

  async createProduct(body) {
    const { name, categoryId, designerId, type, badge, price, priceDisplay, description, count, format, color, isNew, isFeatured } = body;
    if (!name || !type) return { error: 'Thiếu tên hoặc loại sản phẩm', status: 400 };

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
    if (error) return { error: error.message };
    return { data: { id: data.id, name: data.name } };
  },

  async updateProduct(id, body) {
    const fields = ['name', 'category_id', 'designer_id', 'type', 'badge', 'price', 'price_display', 'description', 'count', 'format', 'color', 'is_new', 'is_featured'];
    const updates = {};
    for (const f of fields) {
      if (body[f] !== undefined) updates[f] = body[f];
    }
    const { data, error } = await Product.update(id, updates);
    if (error) return { error: error.message };
    return { data: { id: data.id, name: data.name } };
  },

  async deleteProduct(id) {
    const { error } = await Product.remove(id);
    if (error) return { error: error.message };
    return { data: { message: 'Đã xóa sản phẩm' } };
  },
};

module.exports = adminService;
