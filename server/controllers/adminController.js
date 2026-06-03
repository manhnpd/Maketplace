const adminService = require('../services/adminService');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

const adminGetStats = async (req, res) => {
  const result = await adminService.getStats();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const adminGetOrders = async (req, res) => {
  const { status, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await adminService.getOrders({ status, from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const adminUpdateOrder = async (req, res) => {
  const result = await adminService.updateOrder(req.params.id, req.body);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const adminGetApplications = async (req, res) => {
  const { status, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await adminService.getApplications({ status, from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const adminUpdateApplication = async (req, res) => {
  const result = await adminService.updateApplication(req.params.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const adminGetProducts = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await adminService.getProducts({ from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const adminCreateProduct = async (req, res) => {
  const result = await adminService.createProduct(req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const adminUpdateProduct = async (req, res) => {
  const result = await adminService.updateProduct(req.params.id, req.body);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const adminDeleteProduct = async (req, res) => {
  const result = await adminService.deleteProduct(req.params.id);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = {
  adminGetStats, adminGetOrders, adminUpdateOrder,
  adminGetApplications, adminUpdateApplication,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
};
