import { useState, useEffect } from 'react';
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
import { useToast } from './hooks/useToast';
import { getStats } from './services/api';

function App() {
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'register'
  const [stats, setStats] = useState(null);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="app">
      <Header
        onLoginClick={() => setAuthModal('login')}
        onRegisterClick={() => setAuthModal('register')}
      />

      <main>
        <Hero stats={stats} />
        <ProductGrid showToast={showToast} />
        <Categories showToast={showToast} />
        <HowItWorks />
        <Pricing />
        <Designers />
        <Testimonials />
        <CTA />
      </main>

      <Footer />

      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}
          showToast={showToast}
        />
      )}

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
