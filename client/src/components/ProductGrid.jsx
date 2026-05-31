import { useState, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { getProducts } from '../services/api';
import './ProductGrid.css';

const SVG_ICONS = [
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="12"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  (c) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
];

function ProductPreview({ color }) {
  const icons = [];
  for (let i = 0; i < 10; i++) {
    icons.push(SVG_ICONS[i % SVG_ICONS.length](color));
  }
  return (
    <div className="product-preview-icons">
      {icons.map((icon, i) => <div key={i} className="product-icon-placeholder">{icon}</div>)}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const badgeText = product.badge === 'free' ? '✓ Free' : product.badge === 'pro' ? '⭐ Pro' : '🆕 New';
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-preview">
        <ProductPreview color={product.color} />
        <span className={`product-badge badge-${product.badge}`}>{badgeText}</span>
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-category">{product.category} · {product.count} items</div>
        <div className="product-meta">
          <span className={`product-price ${product.type === 'free' ? 'free' : ''}`}>{product.priceDisplay}</span>
          <span className="product-downloads">
            <Download size={14} /> {product.downloads.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ showToast }) {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts({ filter }).then(res => setProducts(res.data || [])).catch(() => {});
  }, [filter]);

  const handleProductClick = (product) => setSelectedProduct(product);

  const handleDownload = (product) => {
    setSelectedProduct(null);
    if (product.type === 'free') {
      showToast('✅', `Đã tải "${product.name}" thành công!`);
    } else {
      showToast('💎', `Vui lòng nâng cấp gói Pro để tải "${product.name}"`);
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

          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onClick={handleProductClick} />
            ))}
          </div>
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
              <button className="btn btn-primary btn-lg" onClick={() => handleDownload(selectedProduct)}>
                {selectedProduct.type === 'free' ? '⬇️ Tải miễn phí' : `🛒 Mua ngay — ${selectedProduct.priceDisplay}`}
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => setSelectedProduct(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
