const { pricingPlans, designers, testimonials, siteStats } = require('../models/data');

const getPricing = (req, res) => {
  res.json({ success: true, data: pricingPlans });
};

const getDesigners = (req, res) => {
  res.json({ success: true, data: designers });
};

const getTestimonials = (req, res) => {
  res.json({ success: true, data: testimonials });
};

const getStats = (req, res) => {
  res.json({ success: true, data: siteStats });
};

module.exports = { getPricing, getDesigners, getTestimonials, getStats };
