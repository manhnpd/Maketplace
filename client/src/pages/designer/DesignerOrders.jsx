import { useState, useEffect, useCallback } from 'react';
import { designerGetOrders } from '../../services/api';
import './DesignerOrders.css';

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đã giao',
  delivered: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'delivered', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const ITEMS_PER_PAGE = 10;

function formatPrice(price) {
  if (!price && price !== 0) return '0đ';
  return price.toLocaleString('vi-VN') + 'đ';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DesignerOrders({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await designerGetOrders({ page, limit: ITEMS_PER_PAGE });
      const allOrders = res.data || [];
      if (filter !== 'all') {
        setOrders(allOrders.filter(o => o.status === filter));
      } else {
        setOrders(allOrders);
      }
      setTotal(res.total || 0);
    } catch {
      showToast('❌', 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="designer-orders">
      <div className="designer-orders-header">
        <div>
          <h1 className="designer-orders-title">Đơn hàng</h1>
          <span className="designer-orders-count">{total} đơn hàng</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="designer-orders-filters">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            className={`designer-orders-filter ${filter === tab.key ? 'active' : ''}`}
            onClick={() => { setFilter(tab.key); setPage(1); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="designer-loading">Đang tải dữ liệu...</div>
      ) : orders.length === 0 ? (
        <div className="designer-empty">
          <div className="designer-empty-icon">🛒</div>
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="designer-orders-card">
          <div className="designer-table-wrapper">
            <table className="designer-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="designer-orders-id">#{order.id}</td>
                    <td>
                      <div className="designer-orders-customer">
                        <span className="designer-orders-customer-name">{order.customerName}</span>
                        <span className="designer-orders-customer-email">{order.customerEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div className="designer-orders-items">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="designer-orders-item">
                            {item.productName} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="designer-orders-total">{formatPrice(order.total)}</td>
                    <td>
                      <span className={`designer-orders-status designer-orders-status--${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="designer-orders-date">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-pagination-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`admin-pagination-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="admin-pagination-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>&raquo;</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
