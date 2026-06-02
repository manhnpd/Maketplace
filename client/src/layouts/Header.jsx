import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import './Header.css';

export default function Header({ user, onLoginClick, onRegisterClick, onLogout, cartItemCount, onCartClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleNavClick = (id) => {
    if (location.pathname === '/') {
      scrollTo(id);
    } else {
      navigate('/');
      setTimeout(() => scrollTo(id), 100);
    }
    setMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'explore', label: 'Khám phá' },
    { id: 'categories', label: 'Danh mục' },
    { id: 'pricing', label: 'Gói dịch vụ' },
    { id: 'designers', label: 'Designer' },
  ];

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#22C55E"/>
              <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Design<span className="logo-accent">Hub</span></span>
          </Link>

          <nav className="nav">
            {navItems.map(item => (
              <button key={item.id} className="nav-link" onClick={() => handleNavClick(item.id)}>
                {item.label}
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

            {user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button className="user-avatar" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  {getInitials(user.name)}
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-dropdown-avatar">{getInitials(user.name)}</div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item" onClick={() => { onLogout(); setUserMenuOpen(false); }}>
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn btn-outline" onClick={onLoginClick}>Đăng nhập</button>
                <button className="btn btn-primary" onClick={onRegisterClick}>Đăng ký</button>
              </>
            )}

            <button className="cart-icon-btn" onClick={onCartClick}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
        {navItems.map(item => (
          <button key={item.id} className="nav-link" onClick={() => handleNavClick(item.id)}>
            {item.label}
          </button>
        ))}
        <div className="mobile-nav-actions">
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar mobile-avatar">{getInitials(user.name)}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-full" onClick={() => { onCartClick(); setMenuOpen(false); }}>
                <ShoppingCart size={16} />
                Giỏ hàng {cartItemCount > 0 ? `(${cartItemCount})` : ''}
              </button>
              <button className="btn btn-outline btn-full" onClick={() => { onLogout(); setMenuOpen(false); }}>
                <LogOut size={16} />
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-full" onClick={() => { onCartClick(); setMenuOpen(false); }}>
                <ShoppingCart size={16} />
                Giỏ hàng {cartItemCount > 0 ? `(${cartItemCount})` : ''}
              </button>
              <button className="btn btn-outline btn-full" onClick={() => { onLoginClick(); setMenuOpen(false); }}>Đăng nhập</button>
              <button className="btn btn-primary btn-full" onClick={() => { onRegisterClick(); setMenuOpen(false); }}>Đăng ký miễn phí</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
