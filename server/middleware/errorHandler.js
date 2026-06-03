// Centralized error handler
function errorHandler(err, req, res, next) {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ',
  });
}

module.exports = errorHandler;
