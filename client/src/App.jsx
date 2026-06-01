import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Categories from './components/Categories';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Designers from './components/Designers';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import CategoryPage from './components/CategoryPage';
import CheckoutPage from './components/CheckoutPage';
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
              <CTA />
            </>
          } />
          <Route path="/danh-muc/:slug" element={
            <CategoryPage showToast={showToast} cart={cart} />
          } />
          <Route path="/thanh-toan" element={
            <CheckoutPage cart={cart} showToast={showToast} />
          } />
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
