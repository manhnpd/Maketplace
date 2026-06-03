import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, ArrowRight } from 'lucide-react';
import { adminGetStats, adminGetOrders } from '../../services/adminService';
import { useToastContext } from '../../contexts/ToastContext';
import './AdminDashboard.css';

const STATUS_LABELS = {
  pending: 'Cho xu ly',
  processing: 'Dang xu ly',
  shipped: 'Dang giao',
  delivered: 'Da giao',
  cancelled: 'Da huy',
};

function formatPrice(price) {
  if (!price && price !== 0) return '0d';
  return price.toLocaleString('vi-VN') + 'd';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminDashboard() {
  const { showToast } = useToastContext();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminGetStats(),
          adminGetOrders({ limit: 5 }),
        ]);
        setStats(statsRes.data || {});
        setOrders(ordersRes.data || []);
      } catch {
        showToast('❌', 'Khong the tai du lieu dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const orderStatusCounts = stats?.orderStatusCounts || {};
  const statusEntries = Object.entries(orderStatusCounts);

  if (loading) {
    return <div className="admin-loading">Dang tai du lieu...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Dashboard</h1>
      <p className="admin-dashboard-subtitle">Tong quan hoat dong cua DesignHub Marketplace</p>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--products">
            <Package size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Tong san pham</span>
            <span className="admin-stat-value">{stats?.totalProducts ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--orders">
            <ShoppingCart size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Tong don hang</span>
            <span className="admin-stat-value">{stats?.totalOrders ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--users">
            <Users size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Tong nguoi dung</span>
            <span className="admin-stat-value">{stats?.totalUsers ?? 0}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--revenue">
            <DollarSign size={22} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-label">Doanh thu</span>
            <span className="admin-stat-value">{formatPrice(stats?.totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Order Status Badges */}
      {statusEntries.length > 0 && (
        <div className="admin-order-stats">
          <div className="admin-order-stats-title">Trang thai don hang</div>
          <div className="admin-order-stats-row">
            {statusEntries.map(([status, count]) => (
              <div key={status} className={`admin-order-stat-badge admin-order-stat-badge--${status}`}>
                <span className="dot" />
                {STATUS_LABELS[status] || status}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="admin-recent-orders">
        <div className="admin-recent-orders-header">
          <div className="admin-recent-orders-title">Don hang gan day</div>
          <Link to="/admin/don-hang" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            Xem tat ca <ArrowRight size={14} />
          </Link>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khach hang</th>
                <th>Tong tien</th>
                <th>Trang thai</th>
                <th>Ngay</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>
                    Chua co don hang nao
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>#{order.id}</td>
                    <td>{order.customerName || order.customerEmail || '-'}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span className={`admin-status admin-status--${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="admin-quick-links">
        <div className="admin-quick-links-title">Truy cap nhanh</div>
        <div className="admin-quick-links-grid">
          <Link to="/admin/san-pham" className="admin-quick-link">
            <Package size={20} /> Quan ly san pham
          </Link>
          <Link to="/admin/don-hang" className="admin-quick-link">
            <ShoppingCart size={20} /> Quan ly don hang
          </Link>
          <Link to="/admin/designer" className="admin-quick-link">
            <Users size={20} /> Quan ly designer
          </Link>
        </div>
      </div>
    </div>
  );
}
