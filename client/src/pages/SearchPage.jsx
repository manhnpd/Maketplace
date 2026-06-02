import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './SearchPage.css';
import '../components/sections/ProductGrid.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'pro', label: 'Premium' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến' },
  { value: 'price', label: 'Giá' },
];

export default function SearchPage({ showToast, cart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sync input when URL query changes
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Reset page when filter/sort/query changes
  useEffect(() => {
    setPage(1);
  }, [query, filter, sort]);

  // Fetch products
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    const params = { search: query, filter, sort, page, limit: 12 };
    getProducts(params)
      .then((res) => {
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(Math.max(1, Math.ceil((res.total || 0) / 12)));
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [query, filter, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const handleProductClick = (product) => {
    // Navigate to category page or open detail — match existing pattern
  };

  const handleAddToCart = (product) => {
    cart.addToCart(product);
    showToast('🛒', `Đã thêm "${product.name}" vào giỏ hàng`);
  };

  return (
    <div className="search-page section">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">Tìm kiếm</span>
        </nav>

        {/* Search Header */}
        <div className="search-header">
          {query.trim() ? (
            <h1>
              Kết quả tìm kiếm: <span className="search-query-highlight">'{query}'</span>
            </h1>
          ) : (
            <h1>Tìm kiếm sản phẩm</h1>
          )}

          {/* Search Input */}
          <form className="search-input-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm icon, UI kit, template..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Toolbar: results count + filters */}
        {query.trim() && (
          <div className="search-toolbar">
            <div>
              <h2 className="section-title">Sản phẩm</h2>
              <p className="section-desc">
                {loading
                  ? 'Đang tải...'
                  : `${total} kết quả`
                }
                {filter !== 'all'
                  ? ` — ${filter === 'free' ? 'Miễn phí' : 'Premium'}`
                  : ''}
              </p>
            </div>
            <div className="search-filters">
              <div className="search-filter-group">
                <label>Lọc:</label>
                <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
                  {FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="search-filter-group">
                <label>Sắp xếp:</label>
                <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {query.trim() && loading && (
          <div className="search-loading">
            <div className="spinner" />
            <p>Đang tìm kiếm...</p>
          </div>
        )}

        {query.trim() && !loading && products.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm nào</h3>
            <p>
              Không có kết quả cho '{query}'. Thử tìm kiếm với từ khóa khác.
            </p>
            <Link to="/">Khám phá sản phẩm</Link>
          </div>
        )}

        {query.trim() && !loading && products.length > 0 && (
          <>
            <div className="search-results-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="search-pagination">
                <button onClick={handlePrevPage} disabled={page <= 1}>
                  <ArrowLeft size={16} /> Trước
                </button>
                <span className="pagination-info">
                  Trang {page} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={page >= totalPages}>
                  Tiếp <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* No query yet — empty initial state */}
        {!query.trim() && (
          <div className="search-empty">
            <div className="search-empty-icon">🔎</div>
            <h3>Tìm kiếm sản phẩm</h3>
            <p>Nhập từ khóa để tìm kiếm icon, UI kit, template và nhiều hơn nữa.</p>
          </div>
        )}
      </div>
    </div>
  );
}
