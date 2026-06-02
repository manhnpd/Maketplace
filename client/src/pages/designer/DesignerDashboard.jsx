import { useState, useEffect } from 'react';
import { Package, Download, DollarSign, TrendingUp, Star } from 'lucide-react';
import { designerGetStats, designerGetProducts } from '../../services/api';
import './DesignerDashboard.css';

function formatPrice(price) {
  if (!price && price !== 0) return '0d';
  return price.toLocaleString('vi-VN') + 'd';
}

export default function DesignerDashboard({ showToast }) {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, productsRes] = await Promise.all([
          designerGetStats(),
          designerGetProducts(),
        ]);
        setStats(statsRes.data || {});
        setProducts(productsRes.data || []);
      } catch {
        showToast('❌', 'Khong the tai du lieu dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="designer-loading">Dang tai du lieu...</div>;
  }

  return (
    <div className="designer-dashboard">
      <h1 className="designer-dashboard-title">Dashboard</h1>
      <p className="designer-dashboard-subtitle">Tong quan hoat dong cua ban tai DesignHub</p>

      {/* Stat Cards */}
      <div className="designer-stats-grid">
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--products">
            <Package size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tong san pham</span>
            <span className="designer-stat-value">{stats?.totalProducts ?? 0}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--downloads">
            <Download size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tong luot tai</span>
            <span className="designer-stat-value">{stats?.totalDownloads ?? 0}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--revenue">
            <DollarSign size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Doanh thu tong</span>
            <span className="designer-stat-value">{formatPrice(stats?.totalRevenue)}</span>
          </div>
        </div>

        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--monthly">
            <TrendingUp size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Doanh thu thang</span>
            <span className="designer-stat-value">{formatPrice(stats?.monthlyRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="designer-products-section">
        <div className="designer-products-header">
          <div className="designer-products-title">San pham cua ban</div>
          <span className="designer-products-count">{products.length} san pham</span>
        </div>

        {products.length === 0 ? (
          <div className="designer-empty">
            <div className="designer-empty-icon">📦</div>
            <p>Chua co san pham nao</p>
          </div>
        ) : (
          <div className="designer-table-wrapper">
            <table className="designer-table">
              <thead>
                <tr>
                  <th>Ten san pham</th>
                  <th>Danh muc</th>
                  <th>Loai</th>
                  <th>Gia</th>
                  <th>Lượt tai</th>
                  <th>Danh gia</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="designer-product-name">{product.name}</td>
                    <td>{product.category || '-'}</td>
                    <td>
                      <span className={`designer-product-type designer-product-type--${product.type === 'free' ? 'free' : 'pro'}`}>
                        {product.type === 'free' ? 'Free' : 'Pro'}
                      </span>
                    </td>
                    <td className="designer-product-price">
                      {product.type === 'free' ? 'Mien phi' : formatPrice(product.price)}
                    </td>
                    <td>{product.downloads ?? 0}</td>
                    <td>
                      <div className="designer-product-rating">
                        <Star size={14} />
                        <span>{product.rating ?? '0'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
