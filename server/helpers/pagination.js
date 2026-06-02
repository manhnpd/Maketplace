// Parse pagination từ query string
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
};

// Tạo response có pagination
const paginateResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { parsePagination, paginateResponse };
