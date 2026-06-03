import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Package, Globe, ArrowLeft } from 'lucide-react';
import { getDesignerProfile } from '../../../services/siteService';
import { useToastContext } from '../../../contexts/ToastContext';
import './DesignerPublicProfile.css';

function formatPrice(price) {
  if (!price && price !== 0) return '0đ';
  return price.toLocaleString('vi-VN') + 'đ';
}

export default function DesignerPublicProfile() {
  const { showToast } = useToastContext();
  const { id } = useParams();
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDesignerProfile(id);
        setDesigner(res.data || null);
      } catch {
        showToast('❌', 'Không thể tải hồ sơ designer');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="dpp-page">
        <div className="container">
          <div className="dpp-loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="dpp-page">
        <div className="container">
          <div className="dpp-not-found">
            <div className="dpp-not-found-icon">🔍</div>
            <h2>Không tìm thấy designer</h2>
            <p>Designer này không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="btn btn-primary btn-lg">Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  const products = designer.productList || [];

  return (
    <div className="dpp-page">
      <div className="container">
        <Link to="/" className="dpp-back">
          <ArrowLeft size={16} />
          Quay về trang chủ
        </Link>

        {/* Profile Header */}
        <div className="dpp-header">
          <div className="dpp-avatar">
            {designer.name ? designer.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'DS'}
          </div>
          <div className="dpp-info">
            <h1 className="dpp-name">{designer.name}</h1>
            <div className="dpp-role">{designer.role}</div>
            {designer.bio && <p className="dpp-bio">{designer.bio}</p>}
            <div className="dpp-stats">
              <div className="dpp-stat">
                <Package size={16} />
                <span><strong>{designer.products}</strong> sản phẩm</span>
              </div>
              <div className="dpp-stat">
                <Download size={16} />
                <span><strong>{designer.sales}</strong> lượt bán</span>
              </div>
              <div className="dpp-stat">
                <Star size={16} />
                <span><strong>{designer.rating}</strong> đánh giá</span>
              </div>
            </div>
            {designer.specialties && designer.specialties.length > 0 && (
              <div className="dpp-tags">
                {designer.specialties.map((s, i) => (
                  <span key={i} className="dpp-tag">{s}</span>
                ))}
              </div>
            )}
            {(designer.portfolioUrl || designer.socialLinks?.dribbble || designer.socialLinks?.behance) && (
              <div className="dpp-links">
                {designer.portfolioUrl && (
                  <a href={designer.portfolioUrl} target="_blank" rel="noopener noreferrer" className="dpp-link">
                    <Globe size={14} /> Portfolio
                  </a>
                )}
                {designer.socialLinks?.dribbble && (
                  <a href={designer.socialLinks.dribbble} target="_blank" rel="noopener noreferrer" className="dpp-link">
                    Dribbble
                  </a>
                )}
                {designer.socialLinks?.behance && (
                  <a href={designer.socialLinks.behance} target="_blank" rel="noopener noreferrer" className="dpp-link">
                    Behance
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="dpp-products">
          <h2 className="dpp-products-title">Sản phẩm của {designer.name}</h2>
          {products.length === 0 ? (
            <div className="dpp-empty">
              <div className="dpp-empty-icon">📦</div>
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="dpp-products-grid">
              {products.map(product => (
                <Link to={`/san-pham/${product.id}`} key={product.id} className="dpp-product-card">
                  <div className="dpp-product-preview" style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}88)` }}>
                    <span className="dpp-product-badge">{product.badge}</span>
                    <span className="dpp-product-name-preview">{product.name}</span>
                  </div>
                  <div className="dpp-product-info">
                    <h3 className="dpp-product-title">{product.name}</h3>
                    <div className="dpp-product-meta">
                      <span className="dpp-product-price">
                        {product.type === 'free' || product.price === 0 ? 'Miễn phí' : formatPrice(product.price)}
                      </span>
                      <span className="dpp-product-downloads">
                        <Download size={12} /> {product.downloads}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
