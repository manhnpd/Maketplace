import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, PenTool } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToastContext } from '../../contexts/ToastContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/san-pham', icon: Package, label: 'San pham' },
  { to: '/admin/don-hang', icon: ShoppingCart, label: 'Don hang' },
  { to: '/admin/designer', icon: Users, label: 'Designer' },
];

export default function AdminLayout() {
  const { user, logout } = useAuthContext();
  const { showToast } = useToastContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to, end) => {
    if (end) return location.pathname === '/admin';
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    showToast('👋', 'Da dang xuat. Hen gap lai!');
    navigate('/');
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-no-access">
        <div className="admin-no-access-icon">🔒</div>
        <h2>Khong co quyen truy cap</h2>
        <p>Ban can quyen admin de truy cap trang nay.</p>
        <Link to="/" className="btn btn-primary btn-lg">Quay ve trang chu</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Hamburger */}
      <button
        className="admin-hamburger"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      <div
        className={`admin-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">
            <PenTool size={18} />
          </div>
          DesignHub Admin
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <Link
              key={to}
              to={to}
              className={`admin-sidebar-link ${isActive(to, end) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-link admin-sidebar-link--logout" onClick={handleLogout}>
            <LogOut size={20} />
            Dang xuat
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
