// Trạng thái đơn hàng
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Trạng thái đơn ứng dụng designer
const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'];

// Loại sản phẩm
const PRODUCT_TYPES = ['free', 'pro'];

// Tùy chọn sắp xếp sản phẩm
const SORT_OPTIONS = ['newest', 'popular', 'price_asc', 'price_desc', 'rating'];

module.exports = {
  ORDER_STATUSES,
  APPLICATION_STATUSES,
  PRODUCT_TYPES,
  SORT_OPTIONS,
};
