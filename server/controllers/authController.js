const supabase = require('../config/supabase');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
  }

  // Create auth user in Supabase
  const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });

  if (authErr) {
    const msg = authErr.message.includes('already registered')
      ? 'Email đã được đăng ký'
      : authErr.message;
    return res.status(400).json({ success: false, message: msg });
  }

  const userId = authData.user.id;

  // Insert profile
  const { error: profErr } = await User.create({
    id: userId,
    name,
    email,
    role: role || 'user',
  });

  if (profErr) {
    return res.status(500).json({ success: false, message: 'Tạo hồ sơ thất bại' });
  }

  res.status(201).json({
    success: true,
    data: { id: userId, name, email, role: role || 'user' },
    token: authData.session?.access_token || null,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
  }

  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

  if (authErr) {
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
  }

  // Fetch profile
  const { data: profile } = await User.findById(authData.user.id);

  res.json({
    success: true,
    data: {
      id: authData.user.id,
      name: profile?.name || '',
      email: authData.user.email,
      role: profile?.role || 'user',
    },
    token: authData.session.access_token,
  });
};

module.exports = { register, login };
