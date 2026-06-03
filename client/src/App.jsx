import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
// Common components
import AuthModal from './components/common/AuthModal';
import CartDrawer from './components/common/CartDrawer';
import CTA from './components/common/CTA';
// Landing page sections
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import Pricing from './components/sections/Pricing';
import Designers from './components/sections/Designers';
import Testimonials from './components/sections/Testimonials';
// Feature: Product
import ProductGrid from './features/product/components/ProductGridSection';
import Categories from './features/product/components/Categories';
import CategoryPage from './features/product/pages/CategoryPage';
import ProductDetailPage from './features/product/pages/ProductDetailPage';
import SearchPage from './features/product/pages/SearchPage';
// Feature: Order
import CheckoutPage from './features/order/pages/CheckoutPage';
import OrderHistoryPage from './features/order/pages/OrderHistoryPage';
// Feature: Account
import AccountPage from './features/account/pages/AccountPage';
import ForgotPasswordPage from './features/account/pages/ForgotPasswordPage';
// Feature: Wishlist
import WishlistPage from './features/wishlist/pages/WishlistPage';
// Feature: Designer
import DesignerPublicProfile from './features/designer/pages/DesignerPublicProfile';
import DesignerRegisterPage from './features/designer/pages/DesignerRegisterPage';
// Feature: Admin
import AdminLayout from './features/admin/pages/AdminLayout';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminProducts from './features/admin/pages/AdminProducts';
import AdminOrders from './features/admin/pages/AdminOrders';
import AdminDesigners from './features/admin/pages/AdminDesigners';
// Feature: Designer Dashboard
import DesignerLayout from './features/designer-dashboard/pages/DesignerLayout';
import DesignerDashboard from './features/designer-dashboard/pages/DesignerDashboard';
import DesignerProducts from './features/designer-dashboard/pages/DesignerProducts';
import DesignerOrders from './features/designer-dashboard/pages/DesignerOrders';
import DesignerAnalytics from './features/designer-dashboard/pages/DesignerAnalytics';
import DesignerSettings from './features/designer-dashboard/pages/DesignerSettings';
// Contexts
import { useAuthContext } from './contexts/AuthContext';
import { useToastContext } from './contexts/ToastContext';
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
