import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current >= target) {
            setCount(target);
            return;
          }
          setCount(Math.floor(current));
          requestAnimationFrame(update);
        };
        update();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero({ stats }) {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="hero-circle hero-circle-1"></div>
        <div className="hero-circle hero-circle-2"></div>
        <div className="hero-circle hero-circle-3"></div>
      </div>
      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Mới cập nhật hàng tuần
        </div>
        <h1 className="hero-title">
          Marketplace cho<br />
          <span className="text-gradient">Digital Assets</span> chất lượng cao
        </h1>
        <p className="hero-desc">
          Khám phá hàng nghìn icon, template, UI kit và tài nguyên thiết kế từ các designer hàng đầu.
          Miễn phí & Premium — làm được gì cũng được!
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">
              <AnimatedCounter target={stats?.totalProducts || 2847} suffix="+" />
            </span>
            <span className="stat-label">Sản phẩm</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">
              <AnimatedCounter target={stats?.totalDesigners || 563} suffix="+" />
            </span>
            <span className="stat-label">Designer</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">
              <AnimatedCounter target={stats?.totalDownloads || 12450} suffix="+" />
            </span>
            <span className="stat-label">Lượt tải</span>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}>
            Khám phá ngay <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            Xem gói Premium
          </button>
        </div>
      </div>
    </section>
  );
}
