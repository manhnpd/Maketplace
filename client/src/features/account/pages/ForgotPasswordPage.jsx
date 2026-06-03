import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useToastContext } from '../../../contexts/ToastContext';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const { showToast } = useToastContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('⚠️', 'Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('⚠️', 'Email không hợp lệ');
      return;
    }

    setLoading(true);

    // Simulate API call — no Supabase client on frontend
    await new Promise(resolve => setTimeout(resolve, 1200));

    setSent(true);
    setLoading(false);
    showToast('📧', 'Link đặt lại mật khẩu đã được gửi!');
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {!sent ? (
          <>
            {/* Header */}
            <div className="forgot-password-header">
              <div className="forgot-password-icon">🔑</div>
              <h1>Quên mật khẩu?</h1>
              <p>
                Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn.
              </p>
            </div>

            {/* Form */}
            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg forgot-password-submit"
                disabled={loading}
              >
                {loading ? '⏳ Đang gửi...' : (
                  <>
                    <Mail size={18} />
                    Gửi link đặt lại mật khẩu
                  </>
                )}
              </button>
            </form>

            {/* Back to login */}
            <Link
              to="/"
              className="forgot-password-back"
              onClick={(e) => {
                e.preventDefault();
                // Navigate back and trigger login modal — handled by parent
                window.history.back();
              }}
            >
              <ArrowLeft size={16} />
              Quay lại đăng nhập
            </Link>
          </>
        ) : (
          /* Success state */
          <div className="forgot-password-success">
            <div className="forgot-password-success-icon">📧</div>
            <h2>Đã gửi email!</h2>
            <p>
              Link đặt lại mật khẩu đã được gửi đến email của bạn.
              Vui lòng kiểm tra hộp thư (và thư mục spam).
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
              Quay lại trang chủ
            </Link>

            <div style={{ marginTop: 16 }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
              >
                Gửi lại email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
