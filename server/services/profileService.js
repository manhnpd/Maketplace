const User = require('../models/User');
const { mapProfile } = require('../utils/formatters');

const profileService = {
  async getProfile(userId) {
    const { data, error } = await User.findById(userId);
    if (error || !data) return { error: 'Không tìm thấy profile', status: 404 };
    return { data: mapProfile(data) };
  },

  async updateProfile(userId, { name }) {
    if (!name) return { error: 'Tên không được để trống', status: 400 };
    const { data, error } = await User.updateName(userId, name.trim());
    if (error) return { error: error.message };
    return { data: mapProfile(data) };
  },
};

module.exports = profileService;
