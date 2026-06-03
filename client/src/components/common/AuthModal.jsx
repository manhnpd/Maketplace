import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../../services/authService';
import { useToastContext } from '../../contexts/ToastContext';
import { useAuthContext } from '../../contexts/AuthContext';
import './AuthModal.css';

export default function AuthModal({ type, onClose, onSwitch }) {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { login: authLogin } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.success) {
          authLogin(res.data, res.token);
          onClose();
          showToast('👋', 'Đăng nhập thành công! Chào mừng bạn trở lại.');
        }
      } else {
        const res = await register(formData);
        if (res.success) {
          if (res.token) {
            authLogin(res.data, res.token);
          }
          onClose();
          showToast('🎉', 'Đăng ký thành công! Kiểm tra email để xác nhận.');
        }
      }
    } catch (err) {
      showToast('❌', err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="auth-modal-overlay active" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2>{type === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h2>
          <p>{type === 'login' ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản miễn phí'}</p>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {type === 'register' && (
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text" name="name" placeholder="Nguyễn Văn A"
                value={formData.name} onChange={handleChange} required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email" placeholder="you@example.com"
              value={formData.email} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password" name="password" placeholder={type === 'register' ? 'Ít nhất 8 ký tự' : '••••••••'}
              value={formData.password} onChange={handleChange}
              required minLength={type === 'register' ? 8 : 1}
            />
          </div>

          {type === 'register' && (
            <div className="form-group">
              <label>Vai trò</label>
              <div className="role-select">
                <label className="role-option">
                  <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} />
                  <span className="role-card">👤 Người dùng</span>
                </label>
                <label className="role-option">
                  <input type="radio" name="role" value="designer" checked={formData.role === 'designer'} onChange={handleChange} />
                  <span className="role-card">🎨 Designer</span>
                </label>
              </div>
            </div>
          )}

          {type === 'login' && (
            <div className="form-row">
              <label className="checkbox">
                <input type="checkbox" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="form-link" onClick={(e) => { e.preventDefault(); onClose(); navigate('/quen-mat-khau'); }}>Quên mật khẩu?</a>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full">
            {type === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="modal-divider"><span>hoặc</span></div>

        <button className="btn btn-social btn-full">
          🔵 Đăng {type === 'login' ? 'nhập' : 'ký'} với Google
        </button>

        <p className="modal-footer-text">
          {type === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <a href="#" onClick={e => { e.preventDefault(); onSwitch(); }}>
            {type === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
          </a>
        </p>
      </div>
    </div>
  );
}
