import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../../../services/orderService';
import { useToastContext } from '../../../contexts/ToastContext';
import { useCartContext } from '../../../contexts/CartContext';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'cod', icon: '📦', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi nhận sản phẩm' },
  { id: 'bank', icon: '🏦', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua Internet Banking' },
  { id: 'ewallet', icon: '💳', label: 'Ví điện tử', desc: 'MoMo, ZaloPay, VNPay...' },
];

function formatPrice(price) {
  if (price === 0) return 'Miễn phí';
  return price.toLocaleString('vi-VN') + '₫';
}

export default function CheckoutPage() {
  const { showToast } = useToastContext();
  const cart = useCartContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    note: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customerName.trim() || !form.customerEmail.trim() || !form.customerPhone.trim()) {
      showToast('⚠️', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const items = cart.items.map(({ product, quantity }) => ({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    }));

    setLoading(true);
    try {
      const res = await createOrder({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        customerAddress: form.customerAddress.trim(),
        note: form.note.trim(),
        paymentMethod,
        items,
      });

      cart.clearCart();
      setOrderResult(res.data);
      showToast('🎉', 'Đặt hàng thành công!');
    } catch {
      showToast('❌', 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (orderResult) {
    return (
      <div className="section">
        <div className="container">
          <div className="checkout-success">
            <div className="checkout-success-icon">🎉</div>
            <h2 className="checkout-success-title">Đặt hàng thành công!</h2>
            <p className="checkout-success-order">Mã đơn hàng: <strong>#{orderResult.orderId}</strong></p>
            <p className="checkout-success-desc">
              Cảm ơn bạn đã mua sắm! Chúng tôi sẽ liên hệ xác nhận đơn hàng qua email sớm nhất.
            </p>
            <div className="checkout-success-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                🏠 Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.items.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">🛒</div>
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="btn btn-primary btn-lg">Khám phá sản phẩm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: 0 }}>
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">Thanh toán</span>
        </nav>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Thông tin liên hệ */}
            <div className="checkout-section">
              <div className="checkout-section-title">👤 Thông tin liên hệ</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-row" style={{ marginTop: 12 }}>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleChange}
                    placeholder="0912 345 678"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={form.customerAddress}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, quận, thành phố"
                  />
                </div>
              </div>
              <div className="form-group full" style={{ marginTop: 12 }}>
                <label>Ghi chú đơn hàng</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Ghi chú thêm (nếu có)..."
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="checkout-section">
              <div className="checkout-section-title">💳 Phương thức thanh toán</div>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} readOnly />
                    <div className="payment-radio" />
                    <span className="payment-icon">{method.icon}</span>
                    <div>
                      <div className="payment-label">{method.label}</div>
                      <div className="payment-desc">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Nút đặt hàng (mobile) */}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={{ display: 'none' }}
            >
              {loading ? '⏳ Đang xử lý...' : `Đặt hàng — ${formatPrice(cart.total)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-title">📋 Tóm tắt đơn hàng</div>

            <div className="checkout-summary-items">
              {cart.items.map(({ product, quantity }) => (
                <div key={product.id} className="checkout-summary-item">
                  <span className="checkout-summary-item-name">{product.name}</span>
                  <span className="checkout-summary-item-qty">×{quantity}</span>
                  <span className="checkout-summary-item-price">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-total-row">
              <span className="checkout-total-label">Tổng cộng</span>
              <span className="checkout-total-value">{formatPrice(cart.total)}</span>
            </div>

            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '⏳ Đang xử lý...' : `Đặt hàng — ${formatPrice(cart.total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
