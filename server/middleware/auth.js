const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Tạo client riêng cho auth verification — không ảnh hưởng service_role client chính
const authClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Yêu cầu đăng nhập — verify JWT token
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await authClient.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }

  // Dùng authClient riêng để không ảnh hưởng service_role client
  const supabase = require('../config/supabase');
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  req.user = {
    id: user.id,
    email: user.email,
    role: profile?.role || 'user',
    name: profile?.name || '',
  };

  next();
};

// Yêu cầu role admin
const requireAdmin = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập' });
    }
    next();
  });
};

// Yêu cầu role designer
const requireDesigner = async (req, res, next) => {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền designer' });
    }
    next();
  });
};

// Attach user nếu có token, không block nếu không
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const { data: { user } } = await authClient.auth.getUser(token);
    if (user) {
      const supabase = require('../config/supabase');
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'user',
        name: profile?.name || '',
      };
    }
  }
  next();
};

module.exports = { requireAuth, requireAdmin, requireDesigner, optionalAuth };
