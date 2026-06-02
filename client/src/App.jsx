import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import DesignerRegisterPage from './pages/DesignerRegisterPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDesigners from './pages/admin/AdminDesigners';
import DesignerLayout from './pages/designer/DesignerLayout';
import DesignerDashboard from './pages/designer/DesignerDashboard';
import DesignerProducts from './pages/designer/DesignerProducts';
import DesignerOrders from './pages/designer/DesignerOrders';
import DesignerAnalytics from './pages/designer/DesignerAnalytics';
import DesignerSettings from './pages/designer/DesignerSettings';
import DesignerPublicProfile from './pages/DesignerPublicProfile';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CTA from './components/CTA';
import Hero from './components/sections/Hero';
import ProductGrid from './components/sections/ProductGrid';
import Categories from './components/sections/Categories';
import HowItWorks from './components/sections/HowItWorks';
import Pricing from './components/sections/Pricing';
import Designers from './components/sections/Designers';
import Testimonials from './components/sections/Testimonials';
import { useToast } from './hooks/useToast';
import { useCart } from './hooks/useCart';
import { getStats, getStoredUser, clearAuth } from './services/api';

function App() {
  const [authModal, setAuthModal] = useState(null);
  const [user, setUser] = useState(getStoredUser());
  const [stats, setStats] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { toasts, showToast } = useToast();
  const cart = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    showToast('👋', 'Đã đăng xuất. Hẹn gặp lại!');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // Auto redirect theo role
    if (userData.role === 'admin') {
      navigate('/admin');
    } else if (userData.role === 'designer') {
      navigate('/designer');
    }
  };

  useEffect(() => {
    getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="app">
      <Header
        user={user}
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
        onLogout={handleLogout}
        cartItemCount={cart.itemCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero stats={stats} />
              <ProductGrid showToast={showToast} cart={cart} />
              <Categories showToast={showToast} />
              <HowItWorks />
              <Pricing />
              <Designers />
              <Testimonials />
              <CTA onRegisterClick={() => setAuthModal('register')} />
            </>
          } />
          <Route path="/danh-muc/:slug" element={
            <CategoryPage showToast={showToast} cart={cart} />
          } />
          <Route path="/san-pham/:id" element={
            <ProductDetailPage showToast={showToast} cart={cart} user={user} />
          } />
          <Route path="/thanh-toan" element={
            <CheckoutPage cart={cart} showToast={showToast} />
          } />
          <Route path="/dang-ky-designer" element={
            <DesignerRegisterPage showToast={showToast} />
          } />
          <Route path="/tim-kiem" element={
            <SearchPage showToast={showToast} cart={cart} />
          } />
          <Route path="/yeu-thich" element={
            <WishlistPage showToast={showToast} cart={cart} user={user} onLoginClick={() => setAuthModal('login')} />
          } />
          <Route path="/tai-khoan" element={
            <AccountPage showToast={showToast} user={user} onLoginClick={() => setAuthModal('login')} />
          } />
          <Route path="/don-hang" element={
            <OrderHistoryPage showToast={showToast} user={user} onLoginClick={() => setAuthModal('login')} />
          } />
          <Route path="/quen-mat-khau" element={
            <ForgotPasswordPage showToast={showToast} />
          } />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
            <Route index element={<AdminDashboard showToast={showToast} user={user} />} />
            <Route path="san-pham" element={<AdminProducts showToast={showToast} user={user} />} />
            <Route path="don-hang" element={<AdminOrders showToast={showToast} user={user} />} />
            <Route path="designer" element={<AdminDesigners showToast={showToast} user={user} />} />
          </Route>
          {/* Designer routes */}
          <Route path="/designer" element={<DesignerLayout user={user} onLogout={handleLogout} showToast={showToast} />}>
            <Route index element={<DesignerDashboard showToast={showToast} user={user} />} />
            <Route path="san-pham" element={<DesignerProducts showToast={showToast} user={user} />} />
            <Route path="don-hang" element={<DesignerOrders showToast={showToast} user={user} />} />
            <Route path="thong-ke" element={<DesignerAnalytics showToast={showToast} user={user} />} />
            <Route path="cai-dat" element={<DesignerSettings showToast={showToast} user={user} />} />
          </Route>
          {/* Public designer profile */}
          <Route path="/designer/:id" element={<DesignerPublicProfile showToast={showToast} />} />
        </Routes>
      </main>

      <Footer />

      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}
          showToast={showToast}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        showToast={showToast}
      />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <span>{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
