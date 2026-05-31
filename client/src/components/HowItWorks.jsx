import { UserPlus, Search, Download } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    icon: <UserPlus size={32} stroke="#22C55E" />,
    title: 'Đăng ký tài khoản',
    desc: 'Tạo tài khoản miễn phí để bắt đầu khám phá và tải xuống tài nguyên thiết kế.'
  },
  {
    num: '02',
    icon: <Search size={32} stroke="#22C55E" />,
    title: 'Tìm kiếm & Khám phá',
    desc: 'Duyệt qua hàng nghìn sản phẩm, lọc theo danh mục, giá cả và đánh giá.'
  },
  {
    num: '03',
    icon: <Download size={32} stroke="#22C55E" />,
    title: 'Tải xuống & Sử dụng',
    desc: 'Tải xuống ngay lập tức và sử dụng tự do trong dự án của bạn.'
  },
];

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">Cách thức hoạt động</h2>
          <p className="section-desc">Ba bước đơn giản để bắt đầu</p>
        </div>
        <div className="steps-grid">
          {steps.map(step => (
            <div key={step.num} className="step-card">
              <div className="step-number">{step.num}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
