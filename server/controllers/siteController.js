const PricingPlan = require('../models/PricingPlan');
const Designer = require('../models/Designer');
const Testimonial = require('../models/Testimonial');
const SiteStats = require('../models/SiteStats');
const Product = require('../models/Product');
const { mapPricingPlan, mapDesigner, mapTestimonial, mapSiteStats, mapDesignerProfile } = require('../utils/formatters');

// GET /api/pricing
const getPricing = async (req, res) => {
  const { data: plans, error: planErr } = await PricingPlan.findAll();
  if (planErr) return res.status(500).json({ success: false, message: planErr.message });

  res.json({ success: true, data: (plans || []).map(mapPricingPlan) });
};

// GET /api/designers
const getDesigners = async (req, res) => {
  const { data, error } = await Designer.findAll();
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, data: (data || []).map(mapDesigner) });
};

// GET /api/testimonials
const getTestimonials = async (req, res) => {
  const { data, error } = await Testimonial.findAll();
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, data: (data || []).map(mapTestimonial) });
};

// GET /api/stats
const getStats = async (req, res) => {
  const { data, error } = await SiteStats.get();
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, data: mapSiteStats(data) });
};

// GET /api/designers/:id — public designer profile
const getDesignerProfile = async (req, res) => {
  const { data: designer, error } = await Designer.findById(req.params.id);
  if (error || !designer) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy designer' });
  }

  const { data: products } = await Product.findByDesignerPublic(designer.id);
  res.json({ success: true, data: mapDesignerProfile(designer, products || []) });
};

module.exports = { getPricing, getDesigners, getTestimonials, getStats, getDesignerProfile };
