// Simple in-memory users store (demo only — use DB in production)
const users = [];

const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email đã được đăng ký' });
  }

  const user = {
    id: Date.now(),
    name, email, role: role || 'user',
    createdAt: new Date().toISOString()
  };

  users.push({ ...user, password });
  res.status(201).json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
  }

  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
    token: 'demo-token-' + user.id
  });
};

module.exports = { register, login };
