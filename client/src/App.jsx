import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { useAuthContext } from './contexts/AuthContext';
import { useToastContext } from './contexts/ToastContext';
import { useCartContext } from './contexts/CartContext';
import { getStats } from './services/siteService';

function App() {
  const { user, authModal, setAuthModal } = useAuthContext();
  const { showToast } = useToastContext();
  const [stats, setStats] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="app">
      <Header onCartClick={() => setCartOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero stats={stats} />
              <ProductGrid />
              <Categories />
              <HowItWorks />
              <Pricing />
              <Designers />
              <Testimonials />
              <CTA />
            </>
          } />
          <Route path="/danh-muc/:slug" element={<CategoryPage />} />
          <Route path="/san-pham/:id" element={<ProductDetailPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/dang-ky-designer" element={<DesignerRegisterPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />
          <Route path="/yeu-thich" element={<WishlistPage />} />
          <Route path="/tai-khoan" element={<AccountPage />} />
          <Route path="/don-hang" element={<OrderHistoryPage />} />
          <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="san-pham" element={<AdminProducts />} />
            <Route path="don-hang" element={<AdminOrders />} />
            <Route path="designer" element={<AdminDesigners />} />
          </Route>
          {/* Designer routes */}
          <Route path="/designer" element={<DesignerLayout />}>
            <Route index element={<DesignerDashboard />} />
            <Route path="san-pham" element={<DesignerProducts />} />
            <Route path="don-hang" element={<DesignerOrders />} />
            <Route path="thong-ke" element={<DesignerAnalytics />} />
            <Route path="cai-dat" element={<DesignerSettings />} />
          </Route>
          {/* Public designer profile */}
          <Route path="/designer/:id" element={<DesignerPublicProfile />} />
        </Routes>
      </main>

      <Footer />

      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}

export default App;
