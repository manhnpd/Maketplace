const PricingPlan = require('../models/PricingPlan');
const Designer = require('../models/Designer');
const Testimonial = require('../models/Testimonial');
const SiteStats = require('../models/SiteStats');
const Product = require('../models/Product');
const { mapPricingPlan, mapDesigner, mapTestimonial, mapSiteStats, mapDesignerProfile } = require('../utils/formatters');

const siteService = {
  async getPricing() {
    const { data, error } = await PricingPlan.findAll();
    if (error) return { error: error.message };
    return { data: (data || []).map(mapPricingPlan) };
  },

  async getDesigners() {
    const { data, error } = await Designer.findAll();
    if (error) return { error: error.message };
    return { data: (data || []).map(mapDesigner) };
  },

  async getTestimonials() {
    const { data, error } = await Testimonial.findAll();
    if (error) return { error: error.message };
    return { data: (data || []).map(mapTestimonial) };
  },

  async getStats() {
    const { data, error } = await SiteStats.get();
    if (error) return { error: error.message };
    return { data: mapSiteStats(data) };
  },

  async getDesignerProfile(id) {
    const { data: designer, error } = await Designer.findById(id);
    if (error || !designer) return { error: 'Không tìm thấy designer', status: 404 };

    const { data: products } = await Product.findByDesignerPublic(designer.id);
    return { data: mapDesignerProfile(designer, products || []) };
  },
};

module.exports = siteService;
