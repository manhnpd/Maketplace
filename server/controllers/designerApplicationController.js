const supabase = require('../config/supabase');

// POST /api/designer-applications
const createApplication = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    specialties,
    portfolioUrl,
    portfolioFiles,
    bio,
  } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (họ tên, email, SĐT)' });
  }

  if (!specialties || !specialties.length) {
    return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất một chuyên môn' });
  }

  const { data, error } = await supabase
    .from('designer_applications')
    .insert({
      full_name: fullName,
      email,
      phone,
      specialties,
      portfolio_url: portfolioUrl || '',
      portfolio_files: portfolioFiles || [],
      bio: bio || '',
      status: 'pending',
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({
    success: true,
    data: {
      applicationId: data.id,
      status: data.status,
      createdAt: data.created_at,
    },
  });
};

module.exports = { createApplication };
