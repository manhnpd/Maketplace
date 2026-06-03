const Product = require('../models/Product');
const { parsePagination, paginateResponse } = require('../helpers/pagination');
const { mapProduct, mapCategory } = require('../utils/formatters');

// GET /api/products — list with filters, search, pagination
const getProducts = async (req, res) => {
  const { filter, search, category, sort, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  const { data, error, count } = await Product.findAll({ filter, search, category, sort, from, to });
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json(paginateResponse((data || []).map(mapProduct), count, page, limit));
};

// GET /api/products/:id — single product
const getProduct = async (req, res) => {
  const { data, error } = await Product.findById(req.params.id);
  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

  res.json({ success: true, data: mapProduct(data) });
};

// GET /api/categories
const getCategories = async (req, res) => {
  const Category = require('../models/Category');
  const { data, error } = await Category.findAll();
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, data: (data || []).map(mapCategory) });
};

module.exports = { getProducts, getProduct, getCategories };
