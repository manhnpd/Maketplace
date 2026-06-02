import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createDesignerApplication } from '../services/api';
import './DesignerRegisterPage.css';

const SPECIALTIES = [
  'Icon Design',
  'UI Kit',
  'Template Web',
  'Template Mobile',
  'Illustration',
  'Mockup',
  'Font / Typography',
  '3D Asset',
];

const BENEFITS = [
  { icon: '💰', title: 'Hoa hồng 80%', desc: 'Bạn giữ phần lớn doanh thu' },
  { icon: '📢', title: 'Quảng cáo miễn phí', desc: 'Đẩy sản phẩm lên top tìm kiếm' },
  { icon: '📊', title: 'Thống kê chi tiết', desc: 'Theo dõi doanh thu & lượt tải' },
];

export default function DesignerRegisterPage({ showToast }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [portfolioFiles, setPortfolioFiles] = useState([]);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    bio: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSpecialty = (spec) => {
    setSelectedSpecialties(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(f => ({ name: f.name, size: f.size }));
    setPortfolioFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setPortfolioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast('⚠️', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (selectedSpecialties.length === 0) {
      showToast('⚠️', 'Vui lòng chọn ít nhất một chuyên môn');
      return;
    }

    setLoading(true);
    try {
      await createDesignerApplication({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        specialties: selectedSpecialties,
        portfolioUrl: form.portfolioUrl.trim(),
        portfolioFiles: portfolioFiles.map(f => f.name),
        bio: form.bio.trim(),
      });
      setSuccess(true);
      showToast('🎉', 'Đăng ký Designer thành công!');
    } catch {
      showToast('❌', 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="designer-register">
        <div className="container">
          <div className="designer-register-success">
            <div className="designer-register-success-icon">🎨</div>
            <h2>Đăng ký thành công!</h2>
            <p>
              Cảm ơn bạn đã đăng ký trở thành Designer trên DesignHub!
              Chúng tôi sẽ xem xét hồ sơ và phản hồi qua email trong vòng 24 giờ.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                🏠 Về trang chủ
              </button>
              <Link to="/" className="btn btn-outline btn-lg">
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="designer-register">
      <div className="container">
        {/* Hero */}
        <div className="designer-register-hero">
          <div className="designer-register-hero-icon">🎨</div>
          <h1>Trở thành Designer</h1>
          <p>Đăng tải tác phẩm, tiếp cận hàng nghìn người dùng và kiếm tiền từ thiết kế của bạn.</p>
        </div>

        {/* Benefits */}
        <div className="designer-benefits">
          {BENEFITS.map((b, i) => (
            <div key={i} className="designer-benefit">
              <div className="designer-benefit-icon">{b.icon}</div>
              <strong>{b.title}</strong>
              <span>{b.desc}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form className="designer-register-form" onSubmit={handleSubmit}>
          {/* Thông tin cá nhân */}
          <div className="designer-form-section">
            <div className="designer-form-section-title">👤 Thông tin cá nhân</div>
            <div className="form-row">
              <div className="form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0912 345 678"
              />
            </div>
          </div>

          {/* Chuyên môn */}
          <div className="designer-form-section">
            <div className="designer-form-section-title">🎯 Chuyên môn *</div>
            <div className="specialty-tags">
              {SPECIALTIES.map(spec => (
                <button
                  key={spec}
                  type="button"
                  className={`specialty-tag ${selectedSpecialties.includes(spec) ? 'selected' : ''}`}
                  onClick={() => toggleSpecialty(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="designer-form-section">
            <div className="designer-form-section-title">📁 Portfolio</div>
            <div className="form-group">
              <label>Link portfolio (Behance, Dribbble, v.v.)</label>
              <input
                type="url"
                name="portfolioUrl"
                value={form.portfolioUrl}
                onChange={handleChange}
                placeholder="https://behance.net/your-profile"
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                Tải lên tác phẩm mẫu
              </label>
              <div className="portfolio-upload" onClick={() => fileRef.current?.click()}>
                <div className="portfolio-upload-icon">📤</div>
                <p>Kéo thả hoặc nhấn để tải file</p>
                <span>PNG, JPG, SVG, ZIP — tối đa 10MB</span>
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.svg,.zip"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              {portfolioFiles.length > 0 && (
                <div className="portfolio-files">
                  {portfolioFiles.map((f, i) => (
                    <div key={i} className="portfolio-file">
                      📄 {f.name}
                      <button type="button" onClick={() => removeFile(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Giới thiệu */}
          <div className="designer-form-section">
            <div className="designer-form-section-title">✏️ Giới thiệu bản thân</div>
            <div className="form-group">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Mô tả ngắn về bạn, phong cách thiết kế và kinh nghiệm..."
                rows={4}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="designer-terms">
            <input type="checkbox" id="designer-terms" required />
            <label htmlFor="designer-terms">
              Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách hoa hồng</a> của DesignHub.
            </label>
          </div>

          {/* Submit */}
          <div className="designer-register-submit">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? '⏳ Đang gửi đăng ký...' : '🎨 Gửi đăng ký Designer'}
            </button>
            <div className="designer-register-note">
              Chúng tôi sẽ phản hồi qua email trong vòng 24 giờ
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
