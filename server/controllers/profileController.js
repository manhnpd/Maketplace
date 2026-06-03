const profileService = require('../services/profileService');

const getProfile = async (req, res) => {
  const result = await profileService.getProfile(req.user.id);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

const updateProfile = async (req, res) => {
  const result = await profileService.updateProfile(req.user.id, req.body);
  if (result.error) return res.status(result.status || 500).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data });
};

module.exports = { getProfile, updateProfile };
