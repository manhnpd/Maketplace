import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { isLoggedIn, getOrders } from '../services/api';
import './OrderHistoryPage.css';

const STATUS_MAP = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã hủy' },
];

function formatPrice(price) {
  if (!price || price === 0) return 'Miễn phí';
  return price.toLocaleString('vi-VN') + '₫';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function OrderHistoryPage({ showToast, user, onLoginClick }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }

    getOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => showToast('❌', 'Không thể tải danh sách đơn hàng'))
      .finally(() => setLoading(false));
  }, []);

  // Not logged in
  if (!isLoggedIn()) {
    return (
      <div className="section">
        <div className="container">
          <div className="order-history-login">
            <div className="order-history-login-icon">🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
            <button className="btn btn-primary btn-lg" onClick={onLoginClick}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="order-history-loading">
            <Loader2 size={20} className="spin" />
            Đang tải đơn hàng...
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">Đơn hàng của tôi</span>
        </nav>

        <div className="order-history-layout">
          {/* Header */}
          <div>
            <h1 className="order-history-title">📦 Đơn hàng của tôi</h1>
            <p className="order-history-subtitle">
              {orders.length > 0
                ? `Bạn có ${orders.length} đơn hàng`
                : 'Bạn chưa có đơn hàng nào'}
            </p>
          </div>

          {/* Filter */}
          {orders.length > 0 && (
            <div className="order-history-filter">
              {FILTER_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={`order-history-filter-btn ${filter === opt.key ? 'active' : ''}`}
                  onClick={() => setFilter(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Orders list */}
          {filteredOrders.length === 0 ? (
            <div className="order-history-empty">
              <div className="order-history-empty-icon">📦</div>
              <p>
                {filter !== 'all'
                  ? 'Không có đơn hàng nào với trạng thái này.'
                  : 'Bạn chưa có đơn hàng nào.'}
              </p>
              <Link to="/" className="btn btn-primary">Khám phá sản phẩm</Link>
            </div>
          ) : (
            <div className="order-history-list">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="order-history-card"
                  onClick={() => navigate(`/don-hang/${order.id}`)}
                >
                  <div className="order-history-card-top">
                    <span className="order-history-card-id">#{order.id}</span>
                    <span className="order-history-card-date">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <div className="order-history-card-bottom">
                    <div className="order-history-card-meta">
                      <span className={`status-badge ${order.status}`}>
                        {STATUS_MAP[order.status] || order.status}
                      </span>
                      <span className="order-history-card-items">
                        {order.items?.length || 0} sản phẩm
                      </span>
                    </div>
                    <span className="order-history-card-total">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronRight size={18} className="order-history-card-arrow" />
                  </div>

                  {/* Items preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="order-history-card-preview">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="order-history-card-preview-item">
                          {item.productName}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="order-history-card-preview-more">
                          +{order.items.length - 3} khác
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
