const supabase = require('../config/supabase');

// GET /api/profile
const getProfile = async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ success: false, message: 'Không tìm thấy profile' });

  res.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.created_at,
    },
  });
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Tên không được để trống' });

  const { data, error } = await supabase
    .from('profiles')
    .update({ name: name.trim() })
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
  });
};

module.exports = { getProfile, updateProfile };
