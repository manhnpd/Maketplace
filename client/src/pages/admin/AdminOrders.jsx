import { useState, useEffect, useCallback } from 'react';
import { adminGetOrders, adminUpdateOrder } from '../../services/api';
import './AdminOrders.css';

const STATUS_TABS = [
  { key: 'all', label: 'Tat ca' },
  { key: 'pending', label: 'Cho xu ly' },
  { key: 'processing', label: 'Dang xu ly' },
  { key: 'shipped', label: 'Dang giao' },
  { key: 'delivered', label: 'Da giao' },
  { key: 'cancelled', label: 'Da huy' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Cho xu ly' },
  { value: 'processing', label: 'Dang xu ly' },
  { value: 'shipped', label: 'Dang giao' },
  { value: 'delivered', label: 'Da giao' },
  { value: 'cancelled', label: 'Da huy' },
];

const PAYMENT_LABELS = {
  cod: 'COD',
  bank: 'Chuyen khoan',
  ewallet: 'Vi dien tu',
};

const ORDERS_PER_PAGE = 10;

function formatPrice(price) {
  if (!price && price !== 0) return '0d';
  return price.toLocaleString('vi-VN') + 'd';
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminOrders({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: ORDERS_PER_PAGE,
        offset: (page - 1) * ORDERS_PER_PAGE,
      };
      if (filter !== 'all') params.status = filter;
      const res = await adminGetOrders(params);
      setOrders(res.data || []);
      setTotal(res.total || 0);
    } catch {
      showToast('❌', 'Khong the tai danh sach don hang');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await adminUpdateOrder(orderId, { status: newStatus });
      showToast('✅', 'Cap nhat trang thai don hang thanh cong');
      fetchOrders();
    } catch {
      showToast('❌', 'Cap nhat that bai. Vui long thu lai');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PER_PAGE));

  const handleFilterChange = (key) => {
    setFilter(key);
    setPage(1);
  };

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <div>
          <h1 className="admin-orders-title">Quan ly don hang</h1>
          <span className="admin-orders-count">{total} don hang</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-orders-filters">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`admin-orders-filter ${filter === tab.key ? 'active' : ''}`}
            onClick={() => handleFilterChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-orders-card">
        {loading ? (
          <div className="admin-loading">Dang tai du lieu...</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p>Khong co don hang nao</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khach hang</th>
                    <th>Tong tien</th>
                    <th>Thanh toan</th>
                    <th>Trang thai</th>
                    <th>Ngay</th>
                    <th>Hanh dong</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="admin-orders-id">#{order.id}</td>
                      <td>
                        <div className="admin-orders-customer">
                          <span className="admin-orders-customer-name">{order.customerName || '-'}</span>
                          <span className="admin-orders-customer-email">{order.customerEmail || ''}</span>
                        </div>
                      </td>
                      <td className="admin-orders-total">{formatPrice(order.totalAmount)}</td>
                      <td>
                        <span className="admin-orders-payment">
                          {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status admin-status--${order.status}`}>
                          {STATUS_TABS.find(t => t.key === order.status)?.label || order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <select
                            className="admin-status-select"
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <button
                            className="admin-action-btn"
                            disabled={updatingId === order.id}
                            onClick={() => {
                              const select = document.querySelector(`tr[data-order-id="${order.id}"] select`);
                              if (select) handleStatusChange(order.id, select.value);
                            }}
                          >
                            Luu
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`admin-pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="admin-pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
