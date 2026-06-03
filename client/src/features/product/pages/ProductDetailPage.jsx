import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Download, User, ArrowLeft, ShoppingCart, Package, FileText, Palette } from 'lucide-react';
import { getProduct, getProducts } from '../../../services/productService';
import { getReviews, createReview } from '../../../services/reviewService';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useToastContext } from '../../../contexts/ToastContext';
import { useCartContext } from '../../../contexts/CartContext';
import ProductCard, { ProductPreview } from '../components/ProductCard';
import './ProductDetailPage.css';
import '../components/ProductGridSection.css';

export default function ProductDetailPage() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const cart = useCartContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch product data
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setProduct(null);
    setReviews([]);
    setRelated([]);

    getProduct(id)
      .then(res => {
        setProduct(res.data);
        // Fetch related products (same category)
        if (res.data?.categorySlug) {
          getProducts({ category: res.data.categorySlug })
            .then(r => {
              const filtered = (r.data || []).filter(p => p.id !== res.data.id);
              setRelated(filtered.slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));

    getReviews(id)
      .then(res => setReviews(res.data || []))
      .catch(() => {});
  }, [id]);

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;
    cart.addToCart(product);
    showToast('🛒', `Đã thêm "${product.name}" vào giỏ hàng`);
  };

  // Download free product
  const handleDownload = () => {
    if (!product) return;
    showToast('✅', 'Đã tải xuống thành công');
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!user) {
      showToast('⚠️', 'Vui lòng đăng nhập để đánh giá');
      return;
    }
    if (reviewRating === 0) {
      showToast('⚠️', 'Vui lòng chọn số sao đánh giá');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('⚠️', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      showToast('⭐', 'Đã gửi đánh giá thành công!');
      setReviewRating(0);
      setReviewComment('');
      // Refresh reviews
      const res = await getReviews(id);
      setReviews(res.data || []);
    } catch {
      showToast('❌', 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Related product click -> navigate to that product's detail
  const handleRelatedClick = (p) => {
    navigate(`/san-pham/${p.id}`);
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Star rendering helper
  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={`pdp-star ${i < Math.round(rating) ? 'filled' : ''}`}
        fill={i < Math.round(rating) ? '#FACC15' : 'none'}
      />
    ));
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="pdp-loading">
            <div className="pdp-spinner" />
            <div className="pdp-loading-text">Đang tải thông tin sản phẩm...</div>
          </div>
        </div>
      </div>
    );
  }

  // --- 404 State ---
  if (notFound || !product) {
    return (
      <div className="section">
        <div className="container">
          <div className="pdp-not-found">
            <div className="pdp-not-found-icon">{'🔍'}</div>
            <div className="pdp-not-found-title">Không tìm thấy sản phẩm</div>
            <div className="pdp-not-found-desc">
              Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </div>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={18} /> Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Product Detail ---
  const badgeText = product.badge === 'free' ? '✓ Free'
    : product.badge === 'pro' ? '⭐ Pro'
    : '🆕 New';

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : product.rating || 0;

  return (
    <>
      <div className="section">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="pdp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="separator">›</span>
            <Link to={`/danh-muc/${product.categorySlug || ''}`}>{product.category || 'Danh mục'}</Link>
            <span className="separator">›</span>
            <span className="current">{product.name}</span>
          </nav>

          {/* Two-Column Layout */}
          <div className="pdp-layout">
            {/* Left: Preview */}
            <div className="pdp-preview" style={{ background: product.color || 'var(--gray-50)' }}>
              <span className={`pdp-badge badge-${product.badge || 'free'}`}>{badgeText}</span>
              {product.count > 1 ? (
                <ProductPreview color="rgba(255,255,255,0.7)" />
              ) : (
                <div className="pdp-preview-fallback" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {product.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="pdp-info">
              {/* Category Badge */}
              <div className="pdp-category-badge">
                <Package size={14} />
                {product.category}
              </div>

              {/* Product Name */}
              <h1 className="pdp-name">{product.name}</h1>

              {/* Meta Row */}
              <div className="pdp-meta-row">
                <div className="pdp-rating">
                  <div className="pdp-stars">{renderStars(avgRating)}</div>
                  <span className="pdp-rating-value">{avgRating.toFixed(1)}</span>
                  <span className="pdp-rating-count">({reviews.length} đánh giá)</span>
                </div>
                <div className="pdp-downloads">
                  <Download size={15} />
                  {product.downloads?.toLocaleString()} lượt tải
                </div>
              </div>

              {/* Designer */}
              {product.designer && (
                <div className="pdp-designer">
                  <User size={15} />
                  Thiết kế bởi{' '}
                  <Link to={`/danh-muc/${product.categorySlug || ''}`}>{product.designer}</Link>
                </div>
              )}

              {/* Price */}
              <div className="pdp-price-section">
                <div className={`pdp-price ${product.type === 'free' ? 'free' : ''}`}>
                  {product.type === 'free' ? 'Miễn phí' : product.priceDisplay}
                </div>
              </div>

              {/* Description */}
              <p className="pdp-description">{product.description}</p>

              {/* Details Grid */}
              <div className="pdp-details-grid">
                <div className="pdp-detail-item">
                  <div className="pdp-detail-value">
                    <Package size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {product.count}
                  </div>
                  <div className="pdp-detail-label">Số lượng</div>
                </div>
                <div className="pdp-detail-item">
                  <div className="pdp-detail-value">
                    <FileText size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {product.format}
                  </div>
                  <div className="pdp-detail-label">Định dạng</div>
                </div>
                <div className="pdp-detail-item">
                  <div className="pdp-detail-value">
                    <Palette size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {product.color ? '●' : 'N/A'}
                  </div>
                  <div className="pdp-detail-label">Màu sắc</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pdp-actions">
                {product.type === 'free' ? (
                  <button className="btn btn-primary btn-lg" onClick={handleDownload}>
                    <Download size={18} /> Tải miễn phí
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                      <ShoppingCart size={18} /> Thêm vào giỏ
                    </button>
                    <button className="btn btn-outline btn-lg" onClick={handleAddToCart}>
                      Mua ngay — {product.priceDisplay}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pdp-reviews-section">
            <h2 className="pdp-reviews-title">Đánh giá sản phẩm</h2>

            {/* Review Form */}
            <div className="pdp-review-form">
              <div className="pdp-review-form-title">
                {user ? `Viết đánh giá` : 'Đăng nhập để viết đánh giá'}
              </div>

              {user && (
                <>
                  <div className="pdp-star-selector">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        onMouseEnter={() => setReviewHover(i + 1)}
                        onMouseLeave={() => setReviewHover(0)}
                      >
                        <Star
                          size={28}
                          fill={i < (reviewHover || reviewRating) ? '#FACC15' : 'none'}
                          color={i < (reviewHover || reviewRating) ? '#FACC15' : 'var(--gray-300)'}
                        />
                      </button>
                    ))}
                    <span style={{ marginLeft: 8, fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                      {reviewRating > 0 && `${reviewRating} sao`}
                    </span>
                  </div>

                  <textarea
                    className="pdp-review-textarea"
                    placeholder="Chia sẻ体验 của bạn về sản phẩm này..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={4}
                  />

                  <div className="pdp-review-submit">
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmitReview}
                      disabled={submitting}
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="pdp-reviews-empty">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
              </div>
            ) : (
              <div className="pdp-reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="pdp-review-card">
                    <div className="pdp-review-header">
                      <div className="pdp-review-user">
                        <div className="pdp-review-avatar">
                          {(review.userName || review.user_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="pdp-review-username">
                            {review.userName || review.user_name || 'Ảo danh'}
                          </div>
                          <div className="pdp-review-date">
                            {formatDate(review.createdAt || review.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pdp-review-stars">
                      {renderStars(review.rating || 0, 14)}
                    </div>
                    <div className="pdp-review-comment">{review.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="pdp-related-section">
              <h2 className="pdp-related-title">Sản phẩm liên quan</h2>
              <div className="pdp-related-grid">
                {related.map(p => (
                  <ProductCard key={p.id} product={p} onClick={handleRelatedClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
