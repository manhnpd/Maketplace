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

module.exports = { getPricing, getDesigners, getTestimonials, getStats };
