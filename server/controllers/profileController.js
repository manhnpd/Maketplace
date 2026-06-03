const User = require('../models/User');
const { mapProfile } = require('../utils/formatters');

// GET /api/profile
const getProfile = async (req, res) => {
  const { data, error } = await User.findById(req.user.id);
  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy profile' });

  res.json({ success: true, data: mapProfile(data) });
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Tên không được để trống' });

  const { data, error } = await User.updateName(req.user.id, name.trim());
  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, data: mapProfile(data) });
};

module.exports = { getProfile, updateProfile };
