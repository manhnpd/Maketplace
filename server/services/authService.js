const supabase = require('../config/supabase');
const { supabaseAdmin } = require('../config/supabase');
const User = require('../models/User');

const authService = {
  async register({ name, email, password, role }) {
    if (!name || !email || !password) {
      return { error: 'Vui lòng điền đầy đủ thông tin', status: 400 };
    }

    const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
    if (authErr) {
      const msg = authErr.message.includes('already registered') ? 'Email đã được đăng ký' : authErr.message;
      return { error: msg, status: 400 };
    }

    const userId = authData.user.id;
    // Use admin client (no session) so service_role key bypasses RLS
    const { error: profErr } = await supabaseAdmin.from('profiles').insert({ id: userId, name, email, role: role || 'user' });
    if (profErr) return { error: 'Tạo hồ sơ thất bại', status: 500 };

    return {
      data: { id: userId, name, email, role: role || 'user' },
      token: authData.session?.access_token || null,
      status: 201,
    };
  },

  async login({ email, password }) {
    if (!email || !password) {
      return { error: 'Vui lòng nhập email và mật khẩu', status: 400 };
    }

    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    if (authErr) return { error: 'Email hoặc mật khẩu không đúng', status: 401 };

    const { data: profile } = await User.findById(authData.user.id);

    return {
      data: {
        id: authData.user.id,
        name: profile?.name || '',
        email: authData.user.email,
        role: profile?.role || 'user',
      },
      token: authData.session.access_token,
    };
  },
};

module.exports = authService;
