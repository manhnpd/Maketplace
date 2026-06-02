const supabase = require('../config/supabase');

// GET /api/pricing
const getPricing = async (req, res) => {
  const { data: plans, error: planErr } = await supabase
    .from('pricing_plans')
    .select('*, pricing_features(*)')
    .order('monthly_price');
  if (planErr) return res.status(500).json({ success: false, message: planErr.message });

  const result = (plans || []).map(p => ({
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
  }));

  res.json({ success: true, data: result });
};

// GET /api/designers
const getDesigners = async (req, res) => {
  const { data, error } = await supabase.from('designers').select('*').order('id');
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(d => ({
    id: d.id,
    name: d.name,
    avatar: d.avatar,
    role: d.role,
    products: d.products,
    sales: d.sales,
    rating: Number(d.rating),
  }));

  res.json({ success: true, data: result });
};

// GET /api/testimonials
const getTestimonials = async (req, res) => {
  const { data, error } = await supabase.from('testimonials').select('*').order('id');
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(t => ({
    id: t.id,
    name: t.name,
    avatar: t.avatar,
    role: t.role,
    stars: t.stars,
    text: t.text,
  }));

  res.json({ success: true, data: result });
};

// GET /api/stats
const getStats = async (req, res) => {
  const { data, error } = await supabase.from('site_stats').select('*').single();
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      totalProducts: data.total_products,
      totalDesigners: data.total_designers,
      totalDownloads: data.total_downloads,
    },
  });
};

// GET /api/designers/:id — public designer profile
const getDesignerProfile = async (req, res) => {
  const { data: designer, error } = await supabase
    .from('designers')
    .select('*')
    .eq('id', parseInt(req.params.id))
    .single();

  if (error || !designer) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy designer' });
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('designer_id', designer.id);

  res.json({
    success: true,
    data: {
      id: designer.id,
      name: designer.name,
      avatar: designer.avatar,
      role: designer.role,
      bio: designer.bio || '',
      portfolioUrl: designer.portfolio_url || '',
      socialLinks: designer.social_links || {},
      specialties: designer.specialties || [],
      slug: designer.slug || '',
      products: designer.products || 0,
      sales: designer.sales || 0,
      rating: Number(designer.rating) || 0,
      productList: (products || []).map(p => ({
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
      })),
    },
  });
};

module.exports = { getPricing, getDesigners, getTestimonials, getStats, getDesignerProfile };
