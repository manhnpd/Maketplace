const Product = require('../models/Product');
const Category = require('../models/Category');
const { mapProduct, mapCategory } = require('../utils/formatters');

const productService = {
  async getProducts({ filter, search, category, sort, from, to }) {
    const { data, error, count } = await Product.findAll({ filter, search, category, sort, from, to });
    if (error) return { error: error.message };
    return { data: (data || []).map(mapProduct), count };
  },

  async getProduct(id) {
    const { data, error } = await Product.findById(id);
    if (error || !data) return { error: 'Không tìm thấy sản phẩm', status: 404 };
    return { data: mapProduct(data) };
  },

  async getCategories() {
    const { data, error } = await Category.findAll();
    if (error) return { error: error.message };
    return { data: (data || []).map(mapCategory) };
  },
};

module.exports = productService;
