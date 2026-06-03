const { supabaseAdmin: db } = require('../config/supabase');

const Product = {
  // List with filters, search, pagination
  async findAll({ filter, search, category, sort, from, to }) {
    let query = db
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
      const { data: catData } = await db
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
      case 'newest': query = query.order('created_at', { ascending: false }); break;
      case 'popular': query = query.order('downloads', { ascending: false }); break;
      case 'price_asc': query = query.order('price', { ascending: true }); break;
      case 'price_desc': query = query.order('price', { ascending: false }); break;
      case 'rating': query = query.order('rating', { ascending: false }); break;
      default: query = query.order('id');
    }

    query = query.range(from, to);

    const { data, error, count } = await query;
    return { data, error, count };
  },

  // Single product by ID
  async findById(id) {
    return db
      .from('products')
      .select('*, categories(name, slug), designers(name, avatar, role)')
      .eq('id', parseInt(id))
      .single();
  },

  // Products by designer
  async findByDesigner(designerId) {
    return db
      .from('products')
      .select('*, categories(name)', { count: 'exact' })
      .eq('designer_id', designerId)
      .order('id');
  },

  // Products by designer — IDs only
  async findIdsByDesigner(designerId) {
    return db
      .from('products')
      .select('id')
      .eq('designer_id', designerId);
  },

  // Products by designer with stats
  async findStatsByDesigner(designerId) {
    return db
      .from('products')
      .select('id, downloads, price')
      .eq('designer_id', designerId);
  },

  // Products by designer with full detail for analytics
  async findAnalyticsByDesigner(designerId) {
    return db
      .from('products')
      .select('id, name, downloads, price, rating')
      .eq('designer_id', designerId);
  },

  // Products by designer for public profile
  async findByDesignerPublic(designerId) {
    return db
      .from('products')
      .select('*, categories(name)')
      .eq('designer_id', designerId);
  },

  // Find multiple products by IDs (for wishlist)
  async findByIds(ids) {
    return db
      .from('products')
      .select('*')
      .in('id', ids);
  },

  // Check ownership
  async findOwnership(id) {
    return db
      .from('products')
      .select('designer_id')
      .eq('id', parseInt(id))
      .single();
  },

  // Count all
  async count() {
    return db.from('products').select('id', { count: 'exact', head: true });
  },

  // Admin: list all products
  async findAllAdmin({ from, to }) {
    return db
      .from('products')
      .select('*, categories(name), designers(name)', { count: 'exact' })
      .order('id')
      .range(from, to);
  },

  // Create product — auto-assign next available ID to avoid sequence lag
  async create(data) {
    if (!data.id) {
      const { data: maxRow } = await db
        .from('products')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
      if (maxRow && maxRow.length > 0) {
        data.id = maxRow[0].id + 1;
      }
    }
    return db
      .from('products')
      .insert(data)
      .select()
      .single();
  },

  // Update product
  async update(id, data) {
    return db
      .from('products')
      .update(data)
      .eq('id', parseInt(id))
      .select()
      .single();
  },

  // Delete product
  async remove(id) {
    return db
      .from('products')
      .delete()
      .eq('id', parseInt(id));
  },
};

module.exports = Product;
