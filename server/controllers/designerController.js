const supabase = require('../config/supabase');

// GET /api/designer/products — sản phẩm của designer hiện tại
const designerGetProducts = async (req, res) => {
  // Tìm designer theo user_id (qua email)
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', req.user.id)
    .single();

  // Tìm designer record khớp tên hoặc dùng designer_id nếu lưu trong profile
  // Tạm thời lấy tất cả products có designer_id matching
  const { data: designers } = await supabase
    .from('designers')
    .select('id')
    .limit(1);

  // Fallback: lấy products gán cho designer đầu tiên (demo)
  const designerId = designers?.[0]?.id || 1;

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('designer_id', designerId)
    .order('id');

  if (error) return res.status(500).json({ success: false, message: error.message });

  const result = (data || []).map(p => ({
    id: p.id,
    name: p.name,
    category: p.categories?.name || '',
    type: p.type,
    price: p.price,
    priceDisplay: p.price_display,
    downloads: p.downloads,
    rating: Number(p.rating),
    isNew: p.is_new,
    isFeatured: p.is_featured,
    createdAt: p.created_at,
  }));

  res.json({ success: true, data: result });
};

// GET /api/designer/stats — thống kê designer
const designerGetStats = async (req, res) => {
  const { data: designers } = await supabase
    .from('designers')
    .select('id')
    .limit(1);

  const designerId = designers?.[0]?.id || 1;

  const [productsResult, ordersResult] = await Promise.all([
    supabase.from('products').select('id, downloads, price').eq('designer_id', designerId),
    supabase.from('order_items').select('quantity, price, product_id'),
  ]);

  const totalProducts = (productsResult.data || []).length;
  const totalDownloads = (productsResult.data || []).reduce((s, p) => s + (p.downloads || 0), 0);

  // Tính doanh thu giả từ order_items của sản phẩm designer
  const productIds = new Set((productsResult.data || []).map(p => p.id));
  const totalRevenue = (ordersResult.data || [])
    .filter(oi => productIds.has(oi.product_id))
    .reduce((s, oi) => s + (oi.price * oi.quantity), 0);

  res.json({
    success: true,
    data: {
      totalProducts,
      totalDownloads,
      totalRevenue,
      monthlyRevenue: Math.round(totalRevenue * 0.15), // Giả lập doanh thu tháng này (~15% tổng)
    },
  });
};

module.exports = { designerGetProducts, designerGetStats };
