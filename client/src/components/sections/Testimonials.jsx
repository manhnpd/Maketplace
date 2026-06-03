import { useState, useEffect } from 'react';
import { getTestimonials } from '../../services/siteService';
import './Testimonials.css';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials().then(res => setTestimonials(res.data || [])).catch(() => {});
  }, []);

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">💬 Người dùng nói gì</h2>
          <p className="section-desc">Hàng nghìn designer và developer tin tưởng sử dụng DesignHub</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.avatar}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
