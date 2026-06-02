import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, PenTool, Menu, X } from 'lucide-react';
import { clearAuth } from '../../services/api';
import './DesignerLayout.css';

const NAV_ITEMS = [
  { to: '/designer/quan-ly', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/designer/san-pham', icon: Package, label: 'San pham' },
];

export default function DesignerLayout({ user, showToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to, end) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    clearAuth();
    showToast('👋', 'Da dang xuat. Hen gap lai!');
    navigate('/');
  };

  if (user?.role !== 'designer') {
    return (
      <div className="designer-no-access">
        <div className="designer-no-access-icon">🔒</div>
        <h2>Khong co quyen truy cap</h2>
        <p>Ban can quyen designer de truy cap trang nay.</p>
        <Link to="/" className="btn btn-primary btn-lg">Quay ve trang chu</Link>
      </div>
    );
  }

  return (
    <div className="designer-layout">
      {/* Hamburger */}
      <button
        className="designer-hamburger"
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      <div
        className={`designer-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
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
            Dang xuat
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="designer-main">
        <Outlet />
      </main>
    </div>
  );
}
