import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import './Header.css';

export default function Header({ onLoginClick, onRegisterClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#22C55E"/>
              <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design<span className="logo-accent">Hub</span></span>
          </a>

          <nav className="nav">
            {['home', 'explore', 'categories', 'pricing', 'designers'].map(id => (
              <button key={id} className="nav-link" onClick={() => scrollTo(id)}>
                {id === 'home' ? 'Trang chủ' : id === 'explore' ? 'Khám phá' : id === 'categories' ? 'Danh mục' : id === 'pricing' ? 'Gói dịch vụ' : 'Designer'}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-outline" onClick={onLoginClick}>Đăng nhập</button>
            <button className="btn btn-primary" onClick={onRegisterClick}>Đăng ký</button>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
        {['home', 'explore', 'categories', 'pricing', 'designers'].map(id => (
          <button key={id} className="nav-link" onClick={() => scrollTo(id)}>
            {id === 'home' ? 'Trang chủ' : id === 'explore' ? 'Khám phá' : id === 'categories' ? 'Danh mục' : id === 'pricing' ? 'Gói dịch vụ' : 'Designer'}
          </button>
        ))}
        <div className="mobile-nav-actions">
          <button className="btn btn-outline btn-full" onClick={() => { onLoginClick(); setMenuOpen(false); }}>Đăng nhập</button>
          <button className="btn btn-primary btn-full" onClick={() => { onRegisterClick(); setMenuOpen(false); }}>Đăng ký miễn phí</button>
        </div>
      </div>
    </>
  );
}
