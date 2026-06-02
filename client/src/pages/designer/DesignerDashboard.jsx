import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, DollarSign, TrendingUp, Star, Plus, ArrowRight } from 'lucide-react';
import { designerGetStats, designerGetProducts, designerGetOrders } from '../../services/api';
import './DesignerDashboard.css';

function formatPrice(price) {
  if (!price && price !== 0) return '0đ';
  return price.toLocaleString('vi-VN') + 'đ';
}

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đã giao',
  delivered: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function DesignerDashboard({ showToast }) {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, productsRes, ordersRes] = await Promise.all([
          designerGetStats(),
          designerGetProducts(),
          designerGetOrders({ page: 1, limit: 5 }),
        ]);
        setStats(statsRes.data || {});
        setProducts(productsRes.data || []);
        setRecentOrders(ordersRes.data || []);
      } catch {
        showToast('❌', 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="designer-loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="designer-dashboard">
      <h1 className="designer-dashboard-title">Dashboard</h1>
      <p className="designer-dashboard-subtitle">Tổng quan hoạt động của bạn tại DesignHub</p>

      {/* Stat Cards */}
      <div className="designer-stats-grid">
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--products">
            <Package size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tổng sản phẩm</span>
            <span className="designer-stat-value">{stats?.totalProducts ?? 0}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--downloads">
            <Download size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tổng lượt tải</span>
            <span className="designer-stat-value">{stats?.totalDownloads ?? 0}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--revenue">
            <DollarSign size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Doanh thu tổng</span>
            <span className="designer-stat-value">{formatPrice(stats?.totalRevenue)}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--monthly">
            <TrendingUp size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Doanh thu tháng</span>
            <span className="designer-stat-value">{formatPrice(stats?.monthlyRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dd-quick-actions">
        <Link to="/designer/san-pham" className="dd-quick-btn">
          <Plus size={18} />
          Thêm sản phẩm mới
        </Link>
        <Link to="/designer/thong-ke" className="dd-quick-btn dd-quick-btn--outline">
          <TrendingUp size={18} />
          Xem thống kê
        </Link>
        <Link to="/designer/cai-dat" className="dd-quick-btn dd-quick-btn--outline">
          Cài đặt hồ sơ
        </Link>
      </div>

      {/* Two columns: Products + Recent Orders */}
      <div className="dd-columns">
        {/* Products */}
        <div className="designer-products-section">
          <div className="designer-products-header">
            <div className="designer-products-title">Sản phẩm của bạn</div>
            <span className="designer-products-count">{products.length} sản phẩm</span>
          </div>

          {products.length === 0 ? (
            <div className="designer-empty">
              <div className="designer-empty-icon">📦</div>
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="designer-table-wrapper">
              <table className="designer-table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Loại</th>
                    <th>Giá</th>
                    <th>Lượt tải</th>
                    <th>Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map(product => (
                    <tr key={product.id}>
                      <td className="designer-product-name">{product.name}</td>
                      <td>
                        <span className={`designer-product-type designer-product-type--${product.type === 'free' ? 'free' : 'pro'}`}>
                          {product.type === 'free' ? 'Free' : 'Pro'}
                        </span>
                      </td>
                      <td className="designer-product-price">
                        {product.type === 'free' ? 'Miễn phí' : formatPrice(product.price)}
                      </td>
                      <td>{product.downloads ?? 0}</td>
                      <td>
                        <div className="designer-product-rating">
                          <Star size={14} />
                          <span>{product.rating ?? '0'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {products.length > 5 && (
            <Link to="/designer/san-pham" className="dd-view-all">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Recent Orders */}
        <div className="designer-products-section">
          <div className="designer-products-header">
            <div className="designer-products-title">Đơn hàng gần đây</div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="designer-empty">
              <div className="designer-empty-icon">🛒</div>
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="dd-orders-list">
              {recentOrders.map(order => (
                <div key={order.id} className="dd-order-item">
                  <div className="dd-order-info">
                    <span className="dd-order-id">#{order.id}</span>
                    <span className="dd-order-customer">{order.customerName}</span>
                  </div>
                  <div className="dd-order-right">
                    <span className="dd-order-total">{formatPrice(order.total)}</span>
                    <span className={`dd-order-status dd-order-status--${order.status}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/designer/don-hang" className="dd-view-all">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
