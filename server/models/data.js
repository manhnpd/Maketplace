// ===== PRODUCT DATA =====
const products = [
  {
    id: 1, name: "Essential UI Icons", category: "Icon Packs", type: "free",
    badge: "free", downloads: 4852, rating: 4.9, price: 0, priceDisplay: "Miễn phí",
    description: "Bộ 200+ icon cơ bản cho mọi dự án web & mobile. Định dạng SVG, 24x24px, stroke 1.5px.",
    count: 200, format: "SVG", color: "#22C55E", designer: "Minh Nguyễn",
    isNew: false, isFeatured: true
  },
  {
    id: 2, name: "Pro Interface Kit", category: "UI Kits", type: "pro",
    badge: "pro", downloads: 3241, rating: 4.8, price: 99000, priceDisplay: "99.000₫",
    description: "Bộ UI Kit chuyên nghiệp với 500+ component cho dashboard, admin panel và landing page.",
    count: 500, format: "Figma, SVG", color: "#3B82F6", designer: "Thu Lê",
    isNew: false, isFeatured: true
  },
  {
    id: 3, name: "E-Commerce Template", category: "Templates", type: "pro",
    badge: "new", downloads: 2156, rating: 4.7, price: 149000, priceDisplay: "149.000₫",
    description: "Template cửa hàng trực tuyến hoàn chỉnh với giỏ hàng, thanh toán và quản lý sản phẩm.",
    count: 45, format: "HTML, Figma", color: "#8B5CF6", designer: "Hoàng Phạm",
    isNew: true, isFeatured: true
  },
  {
    id: 4, name: "Flat Design Icons", category: "Icon Packs", type: "free",
    badge: "free", downloads: 6734, rating: 4.9, price: 0, priceDisplay: "Miễn phí",
    description: "Bộ icon flat design tối giản, phù hợp cho ứng dụng hiện đại.",
    count: 150, format: "SVG, PNG", color: "#F59E0B", designer: "Minh Nguyễn",
    isNew: false, isFeatured: true
  },
  {
    id: 5, name: "Crypto Dashboard", category: "Templates", type: "pro",
    badge: "pro", downloads: 1876, rating: 4.6, price: 199000, priceDisplay: "199.000₫",
    description: "Dashboard theo dõi cryptocurrency với biểu đồ real-time và portfolio management.",
    count: 30, format: "React, Figma", color: "#EF4444", designer: "Linh Trần",
    isNew: false, isFeatured: false
  },
  {
    id: 6, name: "Social Media Kit", category: "UI Kits", type: "free",
    badge: "new", downloads: 3789, rating: 4.8, price: 0, priceDisplay: "Miễn phí",
    description: "Template thiết kế bài đăng mạng xã hội cho Instagram, Facebook, Twitter.",
    count: 80, format: "Figma, PSD", color: "#EC4899", designer: "Thu Lê",
    isNew: true, isFeatured: true
  },
  {
    id: 7, name: "Travel App UI", category: "UI Kits", type: "pro",
    badge: "pro", downloads: 1234, rating: 4.5, price: 129000, priceDisplay: "129.000₫",
    description: "Giao diện ứng dụng du lịch với bản đồ, đặt phòng và review.",
    count: 60, format: "Figma", color: "#06B6D4", designer: "Hùng Đào",
    isNew: false, isFeatured: false
  },
  {
    id: 8, name: "Illustration Pack", category: "Illustrations", type: "free",
    badge: "free", downloads: 5621, rating: 4.9, price: 0, priceDisplay: "Miễn phí",
    description: "Bộ illustration minh họa phong cách hiện đại cho landing page và marketing.",
    count: 40, format: "SVG, PNG", color: "#22C55E", designer: "Minh Nguyễn",
    isNew: false, isFeatured: true
  },
  {
    id: 9, name: "Dark Mode Icons", category: "Icon Packs", type: "pro",
    badge: "new", downloads: 2890, rating: 4.7, price: 79000, priceDisplay: "79.000₫",
    description: "Bộ icon tối ưu cho dark mode với 2 variant: line & filled.",
    count: 300, format: "SVG", color: "#6366F1", designer: "Linh Trần",
    isNew: true, isFeatured: false
  },
  {
    id: 10, name: "Blog Template", category: "Templates", type: "free",
    badge: "free", downloads: 4123, rating: 4.6, price: 0, priceDisplay: "Miễn phí",
    description: "Template blog cá nhân với responsive design và SEO optimization.",
    count: 15, format: "HTML", color: "#F97316", designer: "Hoàng Phạm",
    isNew: false, isFeatured: false
  },
  {
    id: 11, name: "Fitness App Kit", category: "UI Kits", type: "pro",
    badge: "pro", downloads: 987, rating: 4.4, price: 159000, priceDisplay: "159.000₫",
    description: "UI Kit cho ứng dụng thể hình với theo dõi workout, dinh dưỡng và progress.",
    count: 70, format: "Figma", color: "#10B981", designer: "Hùng Đào",
    isNew: false, isFeatured: false
  },
  {
    id: 12, name: "Arrow Collection", category: "Icon Packs", type: "free",
    badge: "free", downloads: 3456, rating: 4.8, price: 0, priceDisplay: "Miễn phí",
    description: "Bộ mũi tên đa dạng cho navigation, flow chart và diagram.",
    count: 95, format: "SVG", color: "#64748B", designer: "Thu Lê",
    isNew: false, isFeatured: false
  },
];

// ===== CATEGORY DATA =====
const categories = [
  { id: 1, name: "Icon Packs", icon: "🎨", count: 739, slug: "icon-packs" },
  { id: 2, name: "UI Kits", icon: "📐", count: 637, slug: "ui-kits" },
  { id: 3, name: "Templates", icon: "📄", count: 179, slug: "templates" },
  { id: 4, name: "Illustrations", icon: "🖼️", count: 158, slug: "illustrations" },
  { id: 5, name: "Fonts", icon: "🔤", count: 104, slug: "fonts" },
  { id: 6, name: "3D Assets", icon: "🧊", count: 95, slug: "3d-assets" },
  { id: 7, name: "Mockups", icon: "📦", count: 86, slug: "mockups" },
  { id: 8, name: "Presentations", icon: "📊", count: 65, slug: "presentations" },
  { id: 9, name: "Social Media", icon: "📱", count: 64, slug: "social-media" },
  { id: 10, name: "Print", icon: "🖨️", count: 59, slug: "print" },
  { id: 11, name: "Textures", icon: "🎯", count: 44, slug: "textures" },
  { id: 12, name: "Themes", icon: "🎭", count: 43, slug: "themes" },
];

// ===== PRICING PLANS =====
const pricingPlans = [
  {
    id: "free", name: "Free", tagline: "Bắt đầu miễn phí",
    monthlyPrice: 0, yearlyPrice: 0,
    features: [
      { text: "Truy cập 500+ sản phẩm miễn phí", included: true },
      { text: "Tải xuống không giới hạn (Free)", included: true },
      { text: "Định dạng SVG, PNG", included: true },
      { text: "Sản phẩm Premium", included: false },
      { text: "Hỗ trợ ưu tiên", included: false },
    ]
  },
  {
    id: "pro", name: "Pro", tagline: "Cho cá nhân & freelancer", popular: true,
    monthlyPrice: 199000, yearlyPrice: 149000,
    features: [
      { text: "Truy cập tất cả 2.800+ sản phẩm", included: true, highlight: true },
      { text: "Tải xuống không giới hạn", included: true },
      { text: "Định dạng SVG, PNG, Figma", included: true },
      { text: "Bản cập nhật mới mỗi tuần", included: true },
      { text: "Hỗ trợ ưu tiên qua email", included: true },
    ]
  },
  {
    id: "team", name: "Team", tagline: "Cho đội & công ty",
    monthlyPrice: 499000, yearlyPrice: 374000,
    features: [
      { text: "Mọi tính năng của Pro", included: true },
      { text: "Tối đa 10 thành viên", included: true },
      { text: "Giấy phép thương mại", included: true },
      { text: "Hỗ trợ 24/7", included: true },
      { text: "Tùy chỉnh theo yêu cầu", included: true },
    ]
  },
];

// ===== DESIGNER DATA =====
const designers = [
  { id: 1, name: "Minh Nguyễn", avatar: "MN", role: "Icon Designer", products: 45, sales: 12450, rating: 4.9 },
  { id: 2, name: "Thu Lê", avatar: "TL", role: "UI/UX Designer", products: 32, sales: 8930, rating: 4.8 },
  { id: 3, name: "Hoàng Phạm", avatar: "HP", role: "Template Author", products: 28, sales: 6720, rating: 4.7 },
  { id: 4, name: "Linh Trần", avatar: "LT", role: "Illustrator", products: 38, sales: 9870, rating: 4.8 },
  { id: 5, name: "Hùng Đào", avatar: "HD", role: "Product Designer", products: 21, sales: 5340, rating: 4.6 },
];

// ===== TESTIMONIALS =====
const testimonials = [
  {
    id: 1, name: "Minh Nguyễn", avatar: "MN", role: "UI/UX Designer tại FPT",
    stars: 5, text: "Thư viện icon chất lượng cao nhất tôi từng dùng. Gói Pro hoàn toàn xứng đáng với từng đồng!"
  },
  {
    id: 2, name: "Thu Lê", avatar: "TL", role: "Freelance Illustrator",
    stars: 5, text: "Tôi kiếm được hơn 10 triệu mỗi tháng nhờ bán icon pack trên DesignHub. Nền tảng tuyệt vời cho designer!"
  },
  {
    id: 3, name: "Hoàng Phạm", avatar: "HP", role: "Lead Developer tại VNG",
    stars: 5, text: "Từ khi dùng DesignHub, tốc độ thiết kế của team tăng lên gấp đôi. Cập nhật hàng tuần rất có giá trị."
  },
];

// ===== STATS =====
const siteStats = {
  totalProducts: 2847,
  totalDesigners: 563,
  totalDownloads: 12450,
};

module.exports = { products, categories, pricingPlans, designers, testimonials, siteStats };
