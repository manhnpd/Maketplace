const supabase = require('../config/supabase');

// GET /api/products — list with filters
const getProducts = async (req, res) => {
  const { filter, search, category } = req.query;
  let query = supabase
    .from('products')
    .select('*, categories(name, slug), designers(name)')
    .order('id');

  if (filter === 'free') query = query.eq('type', 'free');
  else if (filter === 'pro') query = query.eq('type', 'pro');
  else if (filter === 'new') query = query.eq('is_new', true);

  if (search) {
    const q = search.toLowerCase();
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (category) {
    // Supabase không hỗ trợ filter trực tiếp trên cột bảng join,
    // cần lookup category_id trước rồi filter trên bảng chính
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.toLowerCase())
      .single();
    if (catData) {
      query = query.eq('category_id', catData.id);
    }
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ success: false, message: error.message });

  // Map snake_case DB columns to camelCase matching the old API contract
  const result = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.categories?.name || '',
    type: p.type,
    badge: p.badge,
    downloads: p.downloads,
    rating: Number(p.rating),
    price: p.price,
    priceDisplay: p.price_display,
    description: p.description,
    count: p.count,
    format: p.format,
    color: p.color,
    designer: p.designers?.name || '',
    isNew: p.is_new,
    isFeatured: p.is_featured,
  }));

  res.json({ success: true, data: result, total: result.length });
};

// GET /api/products/:id — single product
const getProduct = async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug), designers(name)')
    .eq('id', parseInt(req.params.id))
    .single();

  if (error || !data) return res.status(404).json({ success: false, message: 'Product not found' });

  const product = {
    id: data.id,
    name: data.name,
    category: data.categories?.name || '',
    type: data.type,
    badge: data.badge,
    downloads: data.downloads,
    rating: Number(data.rating),
    price: data.price,
    priceDisplay: data.price_display,
    description: data.description,
    count: data.count,
    format: data.format,
    color: data.color,
    designer: data.designers?.name || '',
    isNew: data.is_new,
    isFeatured: data.is_featured,
  };

  res.json({ success: true, data: product });
};

// GET /api/categories
const getCategories = async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    count: c.count,
    slug: c.slug,
  }));

  res.json({ success: true, data: result });
};

module.exports = { getProducts, getProduct, getCategories };
