import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, LogIn, X } from 'lucide-react';
import { getWishlist, removeFromWishlist } from '../../../services/wishlistService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToastContext } from '../../../contexts/ToastContext';
import { useCartContext } from '../../../contexts/CartContext';
import ProductCard from '../../product/components/ProductCard';
import './WishlistPage.css';
import '../../product/components/ProductGridSection.css';

export default function WishlistPage() {
  const { user, setAuthModal } = useAuthContext();
  const { showToast } = useToastContext();
  const cart = useCartContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    getWishlist()
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (productId, productName) => {
    try {
      await removeFromWishlist(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('💔', `Đã xóa "${productName}" khỏi danh sách yêu thích`);
    } catch {
      showToast('❌', 'Không thể xóa. Vui lòng thử lại.');
    }
  };

  const handleProductClick = (product) => {
    // Navigate to product detail or category page
  };

  const handleAddToCart = (product) => {
    cart.addToCart(product);
    showToast('🛒', `Đã thêm "${product.name}" vào giỏ hàng`);
  };

  // Not logged in
  if (!user) {
    return (
      <div className="wishlist-page section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="separator">›</span>
            <span className="current">Yêu thích</span>
          </nav>

          <div className="wishlist-auth-required">
            <div className="wishlist-auth-icon">🔒</div>
            <h3>Vui lòng đăng nhập</h3>
            <p>Đăng nhập để xem và quản lý danh sách sản phẩm yêu thích của bạn.</p>
            <button className="btn-login" onClick={() => setAuthModal('login')}>
              <LogIn size={18} /> Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">Yêu thích</span>
        </nav>

        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-header-icon">
            <Heart size={36} color="#EF4444" />
          </div>
          <h1>Danh sách yêu thích</h1>
          <p>
            {loading
              ? 'Đang tải...'
              : `${products.length} sản phẩm`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="wishlist-loading">
            <div className="spinner" />
            <p>Đang tải danh sách yêu thích...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">💝</div>
            <h3>Danh sách yêu thích trống</h3>
            <p>
              Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. Khám phá các sản phẩm tuyệt vời ngay!
            </p>
            <Link to="/">Khám phá sản phẩm</Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && products.length > 0 && (
          <div className="wishlist-grid">
            {products.map((product) => (
              <div key={product.id} className="wishlist-item">
                <button
                  className="wishlist-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id, product.name);
                  }}
                  title="Xóa khỏi yêu thích"
                >
                  <X size={18} />
                </button>
                <ProductCard
                  product={product}
                  onClick={handleProductClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
