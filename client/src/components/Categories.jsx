import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import './Categories.css';

export default function Categories({ showToast }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  return (
    <section className="section section-alt" id="categories">
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">📂 Danh mục sản phẩm</h2>
          <p className="section-desc">Khám phá theo danh mục — từ icon, template đến UI Kit</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => showToast('🔍', `Đang hiển thị danh mục: ${cat.name}`)}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} sản phẩm</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
