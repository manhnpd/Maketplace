import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { getProducts, getCategories } from '../../../services/productService';
import { useToastContext } from '../../../contexts/ToastContext';
import { useCartContext } from '../../../contexts/CartContext';
import ProductCard, { ProductPreview } from '../components/ProductCard';
import './CategoryPage.css';
import '../components/ProductGridSection.css';

export default function CategoryPage() {
  const { showToast } = useToastContext();
  const cart = useCartContext();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getCategories().then(res => {
      const found = (res.data || []).find(c => c.slug === slug);
      setCategory(found || null);
    }).catch(() => {});
  }, [slug]);

  useEffect(() => {
    const params = { filter };
    if (slug) params.category = slug;
    getProducts(params).then(res => setProducts(res.data || [])).catch(() => {});
  }, [slug, filter]);

  const handleProductClick = (product) => setSelectedProduct(product);

  const handleAddToCart = (product) => {
    cart.addToCart(product);
    setSelectedProduct(null);
    showToast('🛒', `Đã thêm "${product.name}" vào giỏ hàng`);
  };

  const handleDownload = (product) => {
    setSelectedProduct(null);
    if (product.type === 'free') {
      showToast('✅', `Đã tải "${product.name}" thành công!`);
    } else {
      handleAddToCart(product);
    }
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(null);
    navigate(`/san-pham/${product.id}`);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="separator">›</span>
            <span>Danh mục</span>
            <span className="separator">›</span>
            <span className="current">{category?.name || slug}</span>
          </nav>

          {/* Category Header */}
          <div className="category-page-header">
            <div className="category-page-icon">{category?.icon || '📂'}</div>
            <h1 className="category-page-title">{category?.name || slug}</h1>
            <p className="category-page-count">{category?.count || products.length} sản phẩm</p>
          </div>

          {/* Filter Tabs */}
          <div className="section-header">
            <div>
              <h2 className="section-title">Sản phẩm</h2>
              <p className="section-desc">
                {products.length} kết quả
                {filter !== 'all' ? ` — ${filter === 'free' ? 'Miễn phí' : filter === 'pro' ? 'Premium' : 'Mới nhất'}` : ''}
              </p>
            </div>
            <div className="filter-tabs">
              {['all', 'free', 'pro', 'new'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'Tất cả' : f === 'free' ? 'Miễn phí' : f === 'pro' ? 'Premium' : 'Mới nhất'}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="products-empty">
              <span style={{ fontSize: '2rem' }}>📭</span>
              <p>Không tìm thấy sản phẩm nào trong danh mục này</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onClick={handleProductClick} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay active" onClick={() => setSelectedProduct(null)}>
          <div className="modal modal-product" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="pm-preview">
              <ProductPreview color={selectedProduct.color} />
            </div>
            <h2 className="pm-title">{selectedProduct.name}</h2>
            <div className="pm-category">{selectedProduct.category}</div>
            <p className="pm-desc">{selectedProduct.description}</p>
            <div className="pm-details">
              <div className="pm-detail">
                <div className="pm-detail-value">{selectedProduct.count}</div>
                <div className="pm-detail-label">Số lượng</div>
              </div>
              <div className="pm-detail">
                <div className="pm-detail-value">{selectedProduct.format}</div>
                <div className="pm-detail-label">Định dạng</div>
              </div>
              <div className="pm-detail">
                <div className="pm-detail-value">{selectedProduct.downloads.toLocaleString()}</div>
                <div className="pm-detail-label">Lượt tải</div>
              </div>
            </div>
            <div className="pm-actions">
              {selectedProduct.type === 'free' ? (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => handleDownload(selectedProduct)}>
                    ⬇️ Tải miễn phí
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={() => handleViewDetail(selectedProduct)}>
                    <Eye size={18} /> Xem chi tiết
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => handleAddToCart(selectedProduct)}>
                    <ShoppingCart size={18} /> Mua ngay — {selectedProduct.priceDisplay}
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={() => handleAddToCart(selectedProduct)}>
                    🛒 Thêm vào giỏ
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={() => handleViewDetail(selectedProduct)}>
                    <Eye size={18} /> Xem chi tiết
                  </button>
                </>
              )}
              <button className="btn btn-outline btn-lg" onClick={() => setSelectedProduct(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
