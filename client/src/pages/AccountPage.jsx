import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, ChevronRight, Loader2 } from 'lucide-react';
import { isLoggedIn } from '../services/api';
import { getProfile, updateProfile } from '../services/profileService';
import { getOrders } from '../services/orderService';
import { useAuthContext } from '../contexts/AuthContext';
import { useToastContext } from '../contexts/ToastContext';
import './AccountPage.css';

const STATUS_MAP = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

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

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AccountPage() {
  const { user, setAuthModal } = useAuthContext();
  const { showToast } = useToastContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          getProfile(),
          getOrders(),
        ]);
        setProfile(profileRes.data || null);
        setOrders(ordersRes.data || []);
      } catch {
        showToast('❌', 'Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Not logged in
  if (!isLoggedIn()) {
    return (
      <div className="section">
        <div className="container">
          <div className="account-login-prompt">
            <div className="account-login-prompt-icon">🔒</div>
            <h2>Vui lòng đăng nhập</h2>
            <p>Bạn cần đăng nhập để xem thông tin tài khoản và đơn hàng.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setAuthModal('login')}>
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
          <div className="account-loading">
            <Loader2 size={20} className="spin" />
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditName(profile?.name || '');
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditName('');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast('⚠️', 'Vui lòng nhập họ tên');
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({ name: editName.trim() });
      setProfile(res.data || { ...profile, name: editName.trim() });
      setEditing(false);
      showToast('✅', 'Cập nhật thông tin thành công');
    } catch {
      showToast('❌', 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name || user?.email || 'Người dùng';

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb account-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">Tài khoản</span>
        </nav>

        <div className="account-layout">
          {/* Header */}
          <div className="account-header">
            <div className="account-avatar">
              {getInitials(displayName)}
            </div>
            <div className="account-header-info">
              <h1>{displayName}</h1>
              <p>{profile?.email || user?.email || ''}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="account-tabs">
            <button
              className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
              Thông tin cá nhân
            </button>
            <button
              className={`account-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={16} style={{ verticalAlign: -3, marginRight: 6 }} />
              Đơn hàng của tôi
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="account-section">
              <div className="account-section-title">👤 Thông tin cá nhân</div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-info-label">Họ tên</span>
                  <span className={`profile-info-value ${!profile?.name ? 'empty' : ''}`}>
                    {profile?.name || 'Chưa cập nhật'}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">
                    {profile?.email || user?.email || ''}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Vai trò</span>
                  <span className="profile-info-value">
                    {profile?.role === 'admin' ? 'Quản trị viên' :
                     profile?.role === 'designer' ? 'Designer' : 'Thành viên'}
                  </span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Ngày tham gia</span>
                  <span className="profile-info-value">
                    {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Edit form */}
              {editing ? (
                <div className="profile-edit-form">
                  <div className="form-group">
                    <label>Họ tên</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nhập họ tên của bạn"
                    />
                  </div>
                  <div className="profile-edit-actions">
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={handleCancelEdit}
                      disabled={saving}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <button className="btn btn-outline" onClick={handleStartEdit}>
                    ✏️ Chỉnh sửa thông tin
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="account-section">
              <div className="account-section-title">📦 Đơn hàng của tôi</div>

              {orders.length === 0 ? (
                <div className="account-empty">
                  <div className="account-empty-icon">📦</div>
                  <p>Bạn chưa có đơn hàng nào.</p>
                  <Link to="/" className="btn btn-primary">Khám phá sản phẩm</Link>
                </div>
              ) : (
                <div className="account-orders-list">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="account-order-card"
                      onClick={() => navigate(`/don-hang/${order.id}`)}
                    >
                      <div className="account-order-left">
                        <span className="account-order-id">
                          #{order.id}
                        </span>
                        <span className="account-order-date">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="account-order-center">
                        <span className={`status-badge ${order.status}`}>
                          {STATUS_MAP[order.status] || order.status}
                        </span>
                        <span className="account-order-items-count">
                          {order.items?.length || 0} sản phẩm
                        </span>
                      </div>
                      <div className="account-order-right">
                        <span className="account-order-total">
                          {formatPrice(order.total)}
                        </span>
                        <ChevronRight size={18} className="account-order-arrow" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
