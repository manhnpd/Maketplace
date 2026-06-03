const siteService = require('../services/siteService');

const getPricing = async (req, res) => {
  const result = await siteService.getPricing();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getDesigners = async (req, res) => {
  const result = await siteService.getDesigners();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getTestimonials = async (req, res) => {
  const result = await siteService.getTestimonials();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getStats = async (req, res) => {
  const result = await siteService.getStats();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getDesignerProfile = async (req, res) => {
  const result = await siteService.getDesignerProfile(req.params.id);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { getPricing, getDesigners, getTestimonials, getStats, getDesignerProfile };
