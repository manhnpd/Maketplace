const authService = require('../services/authService');

const register = async (req, res) => {
  const result = await authService.register(req.body);
  if (result.error) return res.status(result.status || 400).json({ success: false, message: result.error });
  res.status(result.status || 201).json({ success: true, data: result.data, token: result.token });
};

const login = async (req, res) => {
  const result = await authService.login(req.body);
  if (result.error) return res.status(result.status || 401).json({ success: false, message: result.error });
  res.json({ success: true, data: result.data, token: result.token });
};

module.exports = { register, login };
