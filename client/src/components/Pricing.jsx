import { useState, useEffect } from 'react';
import { Shield, Star, Users, Check, X } from 'lucide-react';
import { getPricing } from '../services/api';
import './Pricing.css';

const PLAN_ICONS = {
  free: <Shield size={28} stroke="#22C55E" />,
  pro: <Star size={28} stroke="#22C55E" />,
  team: <Users size={28} stroke="#22C55E" />,
};

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    getPricing().then(res => setPlans(res.data || [])).catch(() => {});
  }, []);

  return (
    <section className="section section-alt" id="pricing">
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">💎 Gói dịch vụ</h2>
          <p className="section-desc">Chọn gói phù hợp với nhu cầu — nâng cấp bất cứ lúc nào</p>
        </div>

        <div className="pricing-toggle">
          <span className={`toggle-label ${!yearly ? 'active' : ''}`}>Hàng tháng</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={yearly} onChange={e => setYearly(e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
          <span className={`toggle-label ${yearly ? 'active' : ''}`}>
            Hàng năm <span className="save-badge">Tiết kiệm 25%</span>
          </span>
        </div>

        <div className="pricing-grid">
          {plans.map(plan => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'pricing-popular' : ''}`}>
                {plan.popular && <div className="popular-badge">⭐ Phổ biến nhất</div>}
                <div className="pricing-header">
                  <div className={`pricing-icon pricing-icon-${plan.id}`}>
                    {PLAN_ICONS[plan.id]}
                  </div>
                  <h3 className="pricing-name">{plan.name}</h3>
                  <p className="pricing-tagline">{plan.tagline}</p>
                </div>
                <div className="pricing-price">
                  <span className="price-amount">
                    {price === 0 ? '0' : price.toLocaleString('vi-VN')}
                  </span>
                  <span className="price-currency">₫</span>
                  <span className="price-period">/tháng</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`feature ${f.included ? 'included' : 'not-included'}`}>
                      {f.included
                        ? <Check size={16} stroke="#22C55E" strokeWidth={2.5} />
                        : <X size={16} stroke="#94A3B8" strokeWidth={2} />
                      }
                      {f.highlight ? <strong>{f.text}</strong> : f.text}
                    </li>
                  ))}
                </ul>
                <button className={`btn btn-full pricing-btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {plan.id === 'free' ? 'Bắt đầu miễn phí' : plan.id === 'pro' ? 'Nâng cấp Pro' : 'Liên hệ chúng tôi'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
