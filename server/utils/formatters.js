// Map snake_case DB → camelCase cho frontend

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.categories?.name || '',
  categorySlug: p.categories?.slug || '',
  categoryId: p.category_id,
  type: p.type,
  badge: p.badge,
  downloads: p.downloads,
  rating: Number(p.rating),
  price: p.price,
  priceDisplay: p.price_display,
  description: p.description,
  count: p.count,
  format: p.format,
  color: p.color,
  designer: p.designers?.name || '',
  designerId: p.designer_id,
  isNew: p.is_new,
  isFeatured: p.is_featured,
  createdAt: p.created_at,
});

const mapProductBrief = (p) => ({
  id: p.id,
  name: p.name,
  category: p.categories?.name || '',
  type: p.type,
  badge: p.badge,
  price: p.price,
  priceDisplay: p.price_display,
  downloads: p.downloads,
  rating: Number(p.rating),
  color: p.color || '#22C55E',
  format: p.format || '',
  isNew: p.is_new,
  isFeatured: p.is_featured,
});

const mapDesignerProduct = (p) => ({
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
});

const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  icon: c.icon,
  count: c.count,
  slug: c.slug,
});

const mapOrderItem = (oi) => ({
  id: oi.id,
  productId: oi.product_id,
  productName: oi.product_name,
  quantity: oi.quantity,
  price: oi.price,
});

const mapOrder = (o) => ({
  id: o.id,
  customerName: o.customer_name,
  customerEmail: o.customer_email,
  customerPhone: o.customer_phone,
  customerAddress: o.customer_address,
  note: o.note,
  paymentMethod: o.payment_method,
  status: o.status,
  total: o.total,
  items: (o.order_items || []).map(mapOrderItem),
  createdAt: o.created_at,
});

const mapOrderBrief = (o) => ({
  id: o.id,
  customerName: o.customer_name,
  customerEmail: o.customer_email,
  customerPhone: o.customer_phone,
  status: o.status,
  total: o.total,
  paymentMethod: o.payment_method,
  itemsCount: (o.order_items || []).length,
  createdAt: o.created_at,
});

const mapApplication = (a) => ({
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
});

const mapDesigner = (d) => ({
  id: d.id,
  name: d.name,
  avatar: d.avatar,
  role: d.role,
  products: d.products,
  sales: d.sales,
  rating: Number(d.rating),
});

const mapDesignerProfile = (d, products = []) => ({
  id: d.id,
  name: d.name,
  avatar: d.avatar,
  role: d.role,
  bio: d.bio || '',
  portfolioUrl: d.portfolio_url || '',
  socialLinks: d.social_links || {},
  specialties: d.specialties || [],
  slug: d.slug || '',
  products: d.products || 0,
  sales: d.sales || 0,
  rating: Number(d.rating) || 0,
  productList: products.map(mapProductBrief),
});

const mapTestimonial = (t) => ({
  id: t.id,
  name: t.name,
  avatar: t.avatar,
  role: t.role,
  stars: t.stars,
  text: t.text,
});

const mapProfile = (p) => ({
  id: p.id,
  name: p.name,
  email: p.email,
  role: p.role,
  createdAt: p.created_at,
});

const mapReview = (r, userNames = {}) => ({
  id: r.id,
  productId: r.product_id,
  userId: r.user_id,
  userName: userNames[r.user_id] || 'Ẩn danh',
  rating: r.rating,
  comment: r.comment,
  createdAt: r.created_at,
});

const mapPricingPlan = (p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  popular: p.popular || false,
  monthlyPrice: p.monthly_price,
  yearlyPrice: p.yearly_price,
  features: (p.pricing_features || []).map(f => ({
    text: f.text,
    included: f.included,
    highlight: f.highlight,
  })),
});

const mapSiteStats = (d) => ({
  totalProducts: d.total_products,
  totalDesigners: d.total_designers,
  totalDownloads: d.total_downloads,
});

module.exports = {
  mapProduct,
  mapProductBrief,
  mapDesignerProduct,
  mapCategory,
  mapOrder,
  mapOrderBrief,
  mapOrderItem,
  mapApplication,
  mapDesigner,
  mapDesignerProfile,
  mapTestimonial,
  mapProfile,
  mapReview,
  mapPricingPlan,
  mapSiteStats,
};
