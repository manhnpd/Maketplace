import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, PenTool, Menu, X } from 'lucide-react';
import { clearAuth } from '../../services/api';
import './DesignerLayout.css';

const NAV_ITEMS = [
  { to: '/designer', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/designer/san-pham', icon: Package, label: 'Sản phẩm' },
  { to: '/designer/don-hang', icon: ShoppingCart, label: 'Đơn hàng' },
  { to: '/designer/thong-ke', icon: BarChart3, label: 'Thống kê' },
  { to: '/designer/cai-dat', icon: Settings, label: 'Cài đặt' },
];

export default function DesignerLayout({ user, showToast, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to, end) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    clearAuth();
    if (onLogout) onLogout();
    else showToast('👋', 'Đã đăng xuất. Hẹn gặp lại!');
    navigate('/');
  };

  if (user?.role !== 'designer') {
    return (
      <div className="designer-no-access">
        <div className="designer-no-access-icon">🔒</div>
        <h2>Không có quyền truy cập</h2>
        <p>Bạn cần quyền designer để truy cập trang này.</p>
        <Link to="/" className="btn btn-primary btn-lg">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="designer-layout">
      <button
        className="designer-hamburger"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`designer-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`designer-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="designer-sidebar-logo">
          <div className="designer-sidebar-logo-icon">
            <PenTool size={18} />
          </div>
          DesignHub Designer
        </div>

        <nav className="designer-sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <Link
              key={to}
              to={to}
              className={`designer-sidebar-link ${isActive(to, end) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="designer-sidebar-footer">
          <button className="designer-sidebar-link designer-sidebar-link--logout" onClick={handleLogout}>
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="designer-main">
        <Outlet />
      </main>
    </div>
  );
}
