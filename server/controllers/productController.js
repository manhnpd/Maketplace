const supabase = require('../config/supabase');
const { parsePagination, paginateResponse } = require('../helpers/pagination');

// Map snake_case DB → camelCase
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  category: p.categories?.name || '',
  categorySlug: p.categories?.slug || '',
  categoryId: p.category_id,
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
  designerId: p.designer_id,
  isNew: p.is_new,
  isFeatured: p.is_featured,
  createdAt: p.created_at,
});

// GET /api/products — list with filters, search, pagination
const getProducts = async (req, res) => {
  const { filter, search, category, sort, page: pageStr, limit: limitStr } = req.query;
  const { page, limit, from, to } = parsePagination({ page: pageStr, limit: limitStr });

  let query = supabase
    .from('products')
    .select('*, categories(name, slug), designers(name)', { count: 'exact' });

  // Filters
  if (filter === 'free') query = query.eq('type', 'free');
  else if (filter === 'pro') query = query.eq('type', 'pro');
  else if (filter === 'new') query = query.eq('is_new', true);

  // Search
  if (search) {
    const q = search.toLowerCase();
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Category filter
  if (category) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category.toLowerCase())
      .single();
    if (catData) {
      query = query.eq('category_id', catData.id);
    }
  }

  // Sort
  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.order('downloads', { ascending: false });
      break;
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default:
      query = query.order('id');
  }

  // Pagination
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(mapProduct);
  res.json(paginateResponse(result, count, page, limit));
};

// GET /api/products/:id — single product
const getProduct = async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug), designers(name, avatar, role)')
    .eq('id', parseInt(req.params.id))
    .single();

  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

  res.json({ success: true, data: mapProduct(data) });
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
