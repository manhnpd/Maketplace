const wishlistService = require('../services/wishlistService');

const getWishlist = async (req, res) => {
  const result = await wishlistService.getWishlist(req.user.id);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const addToWishlist = async (req, res) => {
  const result = await wishlistService.addToWishlist(req.user.id, req.body.productId);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const removeFromWishlist = async (req, res) => {
  const result = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
  if (result.error) return res.status(500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
