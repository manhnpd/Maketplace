const DesignerApplication = require('../models/DesignerApplication');

const designerApplicationService = {
  async createApplication(body) {
    const { fullName, email, phone, specialties, portfolioUrl, portfolioFiles, bio } = body;

    if (!fullName || !email || !phone) {
      return { error: 'Thiếu thông tin bắt buộc (họ tên, email, SĐT)', status: 400 };
    }
    if (!specialties || !specialties.length) {
      return { error: 'Vui lòng chọn ít nhất một chuyên môn', status: 400 };
    }

    const { data, error } = await DesignerApplication.create({
      full_name: fullName,
      email, phone, specialties,
      portfolio_url: portfolioUrl || '',
      portfolio_files: portfolioFiles || [],
      bio: bio || '',
      status: 'pending',
    });
    if (error) return { error: error.message };

    return { data: { applicationId: data.id, status: data.status, createdAt: data.created_at } };
  },
};

module.exports = designerApplicationService;
