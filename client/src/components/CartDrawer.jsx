import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose, cart }) {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = cart;
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handleCheckout = () => {
    onClose();
    navigate('/thanh-toan');
  };

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h3><ShoppingBag size={20} /> Giỏ hàng ({itemCount})</h3>
          <button className="cart-close" onClick={onClose}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Giỏ hàng trống</p>
            <span>Hãy khám phá và thêm sản phẩm yêu thích!</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-preview" style={{ background: product.color + '18' }}>
                    <span style={{ color: product.color, fontSize: '1.5rem' }}>
                      {product.category === 'Icon Packs' ? '🎨' : product.category === 'UI Kits' ? '📐' : product.category === 'Templates' ? '📄' : product.category === 'Illustrations' ? '🖼️' : '📦'}
                    </span>
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{product.name}</div>
                    <div className="cart-item-price">{formatPrice(product.price)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}><Minus size={14} /></button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}><Plus size={14} /></button>
                    </div>
                    <button className="cart-remove" onClick={() => removeFromCart(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Tổng cộng</span>
                <span className="cart-total-price">{formatPrice(total)}</span>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
                Thanh toán
              </button>
              <button className="btn btn-outline btn-full" onClick={clearCart}>
                Xóa tất cả
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
