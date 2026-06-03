const productService = require('../services/productService');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

const getProducts = async (req, res) => {
  const { filter, search, category, sort, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });
  const result = await productService.getProducts({ filter, search, category, sort, from, to });
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json(paginateResponse(result.data, result.count, page, limit));
};

const getProduct = async (req, res) => {
  const result = await productService.getProduct(req.params.id);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const getCategories = async (req, res) => {
  const result = await productService.getCategories();
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { getProducts, getProduct, getCategories };
