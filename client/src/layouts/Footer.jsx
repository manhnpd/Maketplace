import { Link } from 'react-router-dom';
import './Footer.css';

const PRODUCT_LINKS = [
  { name: 'Icon', slug: 'icon-packs' },
  { name: 'Templates', slug: 'templates' },
  { name: 'UI Kits', slug: 'ui-kits' },
  { name: 'Illustrations', slug: 'illustrations' },
  { name: 'Fonts', slug: 'fonts' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#22C55E"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Design<span className="logo-accent">Hub</span></span>
            </div>
            <p className="footer-desc">Marketplace cho digital assets chất lượng cao. Miễn phí & Premium.</p>
            <div className="social-links">
              {['Twitter', 'GitHub', 'Dribbble'].map(name => (
                <a key={name} href="#" className="social-link" aria-label={name}>
                  {name[0]}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-links">
            <h4>Sản phẩm</h4>
            {PRODUCT_LINKS.map(item => (
              <Link key={item.slug} to={`/danh-muc/${item.slug}`}>{item.name}</Link>
            ))}
          </div>
          <div className="footer-links">
            <h4>Công ty</h4>
            {['Về chúng tôi', 'Blog', 'Tuyển dụng', 'Liên hệ'].map(item => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>
          <div className="footer-links">
            <h4>Hỗ trợ</h4>
            {['Trung tâm trợ giúp', 'Giấy phép', 'Điều khoản', 'Bảo mật'].map(item => (
              <a key={item} href="#">{item}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 DesignHub. All rights reserved.</p>
          <p>Made with 💚 in Vietnam</p>
        </div>
      </div>
    </footer>
  );
}
