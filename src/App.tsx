import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { HeroBanner } from './components/storefront/HeroBanner';
import { TrustBadges } from './components/storefront/TrustBadges';
import { FeaturedProducts } from './components/storefront/FeaturedProducts';
import { AtelierLookbook } from './components/storefront/AtelierLookbook';
import { RoutineBuilder } from './components/storefront/RoutineBuilder';
import { CustomerReviews } from './components/storefront/CustomerReviews';
import { ShopCatalog } from './components/storefront/ShopCatalog';
import { Footer } from './components/common/Footer';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackerModal } from './components/orders/OrderTrackerModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShadeFinderModal } from './components/interactive/ShadeFinderModal';
import { WishlistDrawer } from './components/cart/WishlistDrawer';
import { FloatingConcierge } from './components/common/FloatingConcierge';
import { Toast } from './components/common/Toast';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  if (activeView === 'admin-dashboard') {
    return (
      <>
        <AdminDashboard />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#242220]">
      <Header />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroBanner />
            <TrustBadges />
            <FeaturedProducts />
            <AtelierLookbook />
            <RoutineBuilder />
            <CustomerReviews />
          </>
        )}

        {activeView === 'shop' && <ShopCatalog />}

        {activeView === 'tracker' && <OrderTrackerModal />}
      </main>

      <Footer />

      {/* Global Modals, Drawers & Concierge */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <ShadeFinderModal />
      <CheckoutModal />
      <OrderTrackerModal />
      <AdminLoginModal />
      <FloatingConcierge />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
