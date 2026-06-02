import './Designers.css';

export default function Designers() {
  return (
    <section className="section" id="designers">
      <div className="container">
        <div className="designers-banner">
          <div className="designers-content">
            <h2 className="section-title">🎨 Bạn là Designer?</h2>
            <p className="designers-desc">
              Đăng tải tác phẩm của bạn và kiếm tiền! Thiết kế icon, template, UI Kit —
              chúng tôi giúp bạn tiếp cận hàng nghìn người dùng.
              <strong> Hoa hồng cạnh tranh</strong> — bạn giữ phần lớn doanh thu.
            </p>
            <div className="designers-features">
              <div className="df-item">
                <div className="df-icon">💰</div>
                <div>
                  <strong>Hoa hồng 80%</strong>
                  <span>Bạn giữ 80% mỗi lần bán</span>
                </div>
              </div>
              <div className="df-item">
                <div className="df-icon">📢</div>
                <div>
                  <strong>Quảng cáo sản phẩm</strong>
                  <span>Đẩy sản phẩm lên top với phí quảng cáo</span>
                </div>
              </div>
              <div className="df-item">
                <div className="df-icon">📊</div>
                <div>
                  <strong>Thống kê chi tiết</strong>
                  <span>Theo dõi doanh thu & lượt tải</span>
                </div>
              </div>
            </div>
            <div className="designers-actions">
              <button className="btn btn-primary btn-lg">Bắt đầu bán ngay</button>
              <button className="btn btn-outline btn-lg">Tìm hiểu thêm</button>
            </div>
          </div>
          <div className="designers-visual">
            <div className="designers-card-stack">
              <div className="dc-card dc-card-1">
                <div className="dc-chart">
                  {[30, 50, 45, 70, 85, 65, 90].map((h, i) => (
                    <div key={i} className="dc-bar" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="dc-label">Doanh thu tháng này</div>
                <div className="dc-amount">₫ 12.450.000</div>
              </div>
              <div className="dc-card dc-card-2">
                <div className="dc-icon-row">
                  {[0, 1, 2, 3].map(i => <div key={i} className="dc-mini-icon"></div>)}
                </div>
                <div className="dc-label">Sản phẩm đã bán</div>
                <div className="dc-amount">847 lượt tải</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
