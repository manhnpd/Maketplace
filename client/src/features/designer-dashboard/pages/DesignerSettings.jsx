import { useState, useEffect } from 'react';
import { Save, Globe, ExternalLink } from 'lucide-react';
import { designerUpdateProfile, designerGetProducts } from '../../../services/designerService';
import './DesignerSettings.css';

export default function DesignerSettings({ showToast, user }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    portfolioUrl: '',
    specialties: '',
    dribbble: '',
    behance: '',
    twitter: '',
    slug: '',
  });
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await designerGetProducts();
        setProductCount((res.data || []).length);
      } catch { /* ignore */ }
      // Bio, portfolio, etc sẽ load từ profile sau khi có endpoint GET
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const specialties = form.specialties
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const socialLinks = {};
      if (form.dribbble) socialLinks.dribbble = form.dribbble;
      if (form.behance) socialLinks.behance = form.behance;
      if (form.twitter) socialLinks.twitter = form.twitter;

      await designerUpdateProfile({
        bio: form.bio.trim(),
        portfolioUrl: form.portfolioUrl.trim(),
        specialties,
        socialLinks,
        slug: form.slug.trim() || undefined,
      });
      showToast('✅', 'Cập nhật hồ sơ thành công');
    } catch {
      showToast('❌', 'Cập nhật thất bại. Vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="designer-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="designer-settings">
      <h1 className="designer-settings-title">Cài đặt hồ sơ</h1>
      <p className="designer-settings-subtitle">Quản lý thông tin hiển thị công khai của bạn</p>

      <div className="ds-grid">
        {/* Form */}
        <form className="ds-form-card" onSubmit={handleSubmit}>
          <div className="ds-section">
            <h3 className="ds-section-title">Thông tin cơ bản</h3>
            <div className="dp-field">
              <label>Giới thiệu bản thân</label>
              <textarea
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Mô tả ngắn về bạn, phong cách thiết kế và kinh nghiệm..."
                rows={4}
              />
            </div>
            <div className="dp-field">
              <label>Chuyên môn (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={form.specialties}
                onChange={e => handleChange('specialties', e.target.value)}
                placeholder="VD: Icon Design, UI Kit, Template"
              />
            </div>
          </div>

          <div className="ds-section">
            <h3 className="ds-section-title">Liên kết & Portfolio</h3>
            <div className="dp-field">
              <label>Portfolio URL</label>
              <input
                type="url"
                value={form.portfolioUrl}
                onChange={e => handleChange('portfolioUrl', e.target.value)}
                placeholder="https://behance.net/your-profile"
              />
            </div>
            <div className="dp-field">
              <label>Dribbble</label>
              <input
                type="url"
                value={form.dribbble}
                onChange={e => handleChange('dribbble', e.target.value)}
                placeholder="https://dribbble.com/username"
              />
            </div>
            <div className="dp-field">
              <label>Behance</label>
              <input
                type="url"
                value={form.behance}
                onChange={e => handleChange('behance', e.target.value)}
                placeholder="https://behance.net/username"
              />
            </div>
            <div className="dp-field">
              <label>Twitter / X</label>
              <input
                type="url"
                value={form.twitter}
                onChange={e => handleChange('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          <div className="ds-section">
            <h3 className="ds-section-title">URL hồ sơ công khai</h3>
            <div className="dp-field">
              <label>Slug</label>
              <div className="ds-slug-input">
                <span className="ds-slug-prefix">/designer/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="your-name"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="ds-save-btn" disabled={saving}>
            <Save size={18} />
            {saving ? '⏳ Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>

        {/* Preview Card */}
        <div className="ds-preview">
          <div className="ds-preview-label">Xem trước hồ sơ</div>
          <div className="ds-preview-card">
            <div className="ds-preview-avatar">
              {user?.name ? user.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'DS'}
            </div>
            <div className="ds-preview-name">{user?.name || 'Designer'}</div>
            <div className="ds-preview-role">Designer</div>
            <div className="ds-preview-stats">
              <div className="ds-preview-stat">
                <span className="ds-preview-stat-value">{productCount}</span>
                <span className="ds-preview-stat-label">Sản phẩm</span>
              </div>
            </div>
            {form.bio && <p className="ds-preview-bio">{form.bio}</p>}
            {form.specialties && (
              <div className="ds-preview-tags">
                {form.specialties.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                  <span key={i} className="ds-preview-tag">{s}</span>
                ))}
              </div>
            )}
            {(form.portfolioUrl || form.dribbble || form.behance) && (
              <div className="ds-preview-links">
                {form.portfolioUrl && <a href={form.portfolioUrl} target="_blank" rel="noopener noreferrer"><Globe size={14} /> Portfolio</a>}
                {form.dribbble && <a href={form.dribbble} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} /> Dribbble</a>}
                {form.behance && <a href={form.behance} target="_blank" rel="noopener noreferrer"><Globe size={14} /> Behance</a>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
