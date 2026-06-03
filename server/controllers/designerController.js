const designerService = require('../services/designerService');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

const designerGetProducts = async (req, res) => {
  const result = await designerService.getProducts(req.user.id);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data, total: result.total });
};

const designerGetStats = async (req, res) => {
  const result = await designerService.getStats(req.user.id);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const designerCreateProduct = async (req, res) => {
  const result = await designerService.createProduct(req.user.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const designerUpdateProduct = async (req, res) => {
  const result = await designerService.updateProduct(req.user.id, req.params.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const designerDeleteProduct = async (req, res) => {
  const result = await designerService.deleteProduct(req.user.id, req.params.id);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const designerGetOrders = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await designerService.getOrders(req.user.id, { from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const designerGetAnalytics = async (req, res) => {
  const result = await designerService.getAnalytics(req.user.id);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const designerUpdateProfile = async (req, res) => {
  const result = await designerService.updateProfile(req.user.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = {
  designerGetProducts, designerGetStats, designerCreateProduct,
  designerUpdateProduct, designerDeleteProduct, designerGetOrders,
  designerGetAnalytics, designerUpdateProfile,
};
