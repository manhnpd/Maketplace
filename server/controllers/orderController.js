const orderService = require('../services/orderService');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

const createOrder = async (req, res) => {
  const result = await orderService.createOrder(req.body, req.user?.id || null);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getOrders = async (req, res) => {
  const { page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await orderService.getOrders(req.user.id, { from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const getOrderById = async (req, res) => {
  const result = await orderService.getOrderById(req.params.id, req.user.id);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const updateOrderStatus = async (req, res) => {
  const result = await orderService.updateOrderStatus(req.params.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
