import { useState, useEffect } from 'react';
import { Package, Download, DollarSign, TrendingUp, Star } from 'lucide-react';
import { designerGetAnalytics } from '../../services/designerService';
import './DesignerAnalytics.css';

function formatPrice(price) {
  if (!price && price !== 0) return '0đ';
  return price.toLocaleString('vi-VN') + 'đ';
}

const MONTH_LABELS = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

export default function DesignerAnalytics({ showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await designerGetAnalytics();
        setData(res.data || {});
      } catch {
        showToast('❌', 'Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="designer-loading">Đang tải dữ liệu...</div>;
  }

  const summary = data?.summary || {};
  const monthlyData = data?.monthlyData || [];
  const topProducts = data?.topProducts || [];

  // Chuẩn bị dữ liệu biểu đồ: lấy 12 tháng gần nhất
  const now = new Date();
  const chartMonths = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const found = monthlyData.find(m => m.month === key);
    chartMonths.push({
      label: MONTH_LABELS[d.getMonth()],
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    });
  }

  const maxRevenue = Math.max(...chartMonths.map(m => m.revenue), 1);

  return (
    <div className="designer-analytics">
      <h1 className="designer-analytics-title">Thống kê</h1>
      <p className="designer-analytics-subtitle">Phân tích doanh thu và hiệu suất sản phẩm</p>

      {/* Summary Cards */}
      <div className="designer-stats-grid">
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--revenue">
            <DollarSign size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tổng doanh thu</span>
            <span className="designer-stat-value">{formatPrice(summary.totalRevenue)}</span>
          </div>
        </div>
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--products">
            <Package size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Tổng đơn hàng</span>
            <span className="designer-stat-value">{summary.totalOrders || 0}</span>
          </div>
        </div>
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--downloads">
            <Download size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Giá trị trung bình</span>
            <span className="designer-stat-value">{formatPrice(summary.avgOrderValue)}</span>
          </div>
        </div>
        <div className="designer-stat-card">
          <div className="designer-stat-icon designer-stat-icon--monthly">
            <TrendingUp size={22} />
          </div>
          <div className="designer-stat-info">
            <span className="designer-stat-label">Sản phẩm bán chạy</span>
            <span className="designer-stat-value">{topProducts.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="da-chart-section">
        <div className="da-chart-header">
          <h2 className="da-chart-title">Doanh thu theo tháng</h2>
          <span className="da-chart-note">12 tháng gần nhất</span>
        </div>
        <div className="da-chart">
          {chartMonths.map((m, i) => (
            <div key={i} className="da-chart-bar" data-tooltip={`${m.label}: ${formatPrice(m.revenue)} (${m.orders} đơn)`}>
              <div className="da-chart-bar-value">{m.revenue > 0 ? formatPrice(m.revenue) : ''}</div>
              <div
                className="da-chart-bar-fill"
                style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 2)}%` }}
              />
              <div className="da-chart-bar-label">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="da-top-section">
        <div className="da-top-header">
          <h2 className="da-top-title">Sản phẩm nổi bật</h2>
        </div>
        {topProducts.length === 0 ? (
          <div className="designer-empty">
            <div className="designer-empty-icon">📊</div>
            <p>Chưa có dữ liệu thống kê</p>
          </div>
        ) : (
          <div className="designer-table-wrapper">
            <table className="designer-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Lượt tải</th>
                  <th>Doanh thu</th>
                  <th>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(p => (
                  <tr key={p.id}>
                    <td className="designer-product-name">{p.name}</td>
                    <td>{p.downloads}</td>
                    <td className="designer-product-price">{formatPrice(p.revenue)}</td>
                    <td>
                      <div className="designer-product-rating">
                        <Star size={14} />
                        <span>{p.rating}</span>
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
