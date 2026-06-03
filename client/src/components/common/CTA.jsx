import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import './CTA.css';

export default function CTA() {
  const navigate = useNavigate();
  const { setAuthModal } = useAuthContext();

  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-card">
          <h2>Sẵn sàng bắt đầu?</h2>
          <p>Tham gia cùng 12.000+ người dùng và 500+ designer trên DesignHub</p>
          <div className="cta-actions">
            <button className="btn btn-white btn-lg" onClick={() => setAuthModal('register')}>Đăng ký miễn phí</button>
            <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/dang-ky-designer')}>Trở thành Designer</button>
          </div>
        </div>
      </div>
    </section>
  );
}
