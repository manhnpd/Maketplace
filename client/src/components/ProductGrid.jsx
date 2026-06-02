


import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard, { ProductPreview } from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ showToast, cart }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts({ filter }).then(res => setProducts(res.data || [])).catch(() => {});
  }, [filter]);

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

  return (
    <>
      <section className="section" id="explore">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔥 Xu hướng</h2>
              <p className="section-desc">Những sản phẩm được tải nhiều nhất tuần này</p>
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

          {products.length === 0 ? (
            <div className="products-empty">
              <span style={{ fontSize: '2rem' }}>📭</span>
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onClick={handleProductClick} />
              ))}
            </div>
          )}
        </div>
      </section>

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
                <button className="btn btn-primary btn-lg" onClick={() => handleDownload(selectedProduct)}>
                  ⬇️ Tải miễn phí
                </button>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => handleAddToCart(selectedProduct)}>
                    <ShoppingCart size={18} /> Mua ngay — {selectedProduct.priceDisplay}
                  </button>
                  <button className="btn btn-outline btn-lg" onClick={() => handleAddToCart(selectedProduct)}>
                    🛒 Thêm vào giỏ
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
