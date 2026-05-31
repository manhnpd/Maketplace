const { products, categories } = require('../models/data');

// GET /api/products — list with filters
const getProducts = (req, res) => {
  const { filter, search, category } = req.query;
  let result = [...products];

  if (filter === 'free') result = result.filter(p => p.type === 'free');
  else if (filter === 'pro') result = result.filter(p => p.type === 'pro');
  else if (filter === 'new') result = result.filter(p => p.isNew);

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (category) {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  res.json({ success: true, data: result, total: result.length });
};

// GET /api/products/:id — single product
const getProduct = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
};

// GET /api/categories
const getCategories = (req, res) => {
  res.json({ success: true, data: categories });
};

module.exports = { getProducts, getProduct, getCategories };
