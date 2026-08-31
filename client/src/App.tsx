import { useState } from 'react';
import { BasketProvider, useBasket } from './context/BasketContext';
import { PRODUCTS } from './data/products';
import { Product, Cart } from './types';
import { DemoBar } from './components/DemoBar';
import { Navbar } from './components/Navbar';
import { JudgeTourModal } from './components/JudgeTourModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AiShoppingPage } from './pages/AiShoppingPage';
import { CatalogPage } from './pages/CatalogPage';
import { CartPage } from './pages/CartPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MerchantDashboardPage } from './pages/MerchantDashboardPage';
import { AuditLogPage } from './pages/AuditLogPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [demoPrompt, setDemoPrompt] = useState<string>('');
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Orders
  const { items, totalQuantity, subtotal } = useBasket();
  const [sessionCart, setSessionCart] = useState<Cart | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [confirmedAuditId, setConfirmedAuditId] = useState<string>('');

  const fallbackCart: Cart = {
    id: 'global_basket',
    items,
    subtotal,
    discount: 0,
    total: subtotal,
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemoPrompt = (prompt: string) => {
    setDemoPrompt(prompt);
    setCurrentPage('ai-shopping');
  };

  const handleOrderPaid = (order: any, auditId: string) => {
    setConfirmedOrder(order);
    setConfirmedAuditId(auditId);
    setCurrentPage('order-confirmed');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141413] flex flex-col font-sans selection:bg-[#141413] selection:text-[#FAF9F6]">
      {/* 1. Floating Buildathon Simulation DemoBar */}
      <DemoBar
        onLoadDemoPrompt={handleLoadDemoPrompt}
        onNavigate={handleNavigate}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
      />

      {/* 2. Sticky Luxury Editorial Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartItemCount={totalQuantity}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 3. Main Dynamic Content View */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onLoadDemoPrompt={handleLoadDemoPrompt}
            onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
          />
        )}

        {currentPage === 'ai-shopping' && (
          <AiShoppingPage
            initialPrompt={demoPrompt}
            onNavigate={handleNavigate}
            onCartUpdated={(c) => setSessionCart(c)}
            onOrderPaid={handleOrderPaid}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            onSelectProduct={(product) => {
              handleLoadDemoPrompt(`Tell me more about ${product.name}`);
            }}
            onNavigate={handleNavigate}
            onQuickView={(product) => setSelectedProduct(product)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cart={sessionCart || fallbackCart}
            onNavigate={handleNavigate}
            onCartUpdated={(c) => setSessionCart(c)}
            onOrderPaid={handleOrderPaid}
          />
        )}

        {currentPage === 'order-confirmed' && (
          <OrderConfirmationPage
            order={confirmedOrder}
            auditId={confirmedAuditId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'merchant' && (
          <MerchantDashboardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'audit' && (
          <AuditLogPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* 4. Luxury Footer */}
      <Footer onNavigateSection={(sec) => handleNavigate(sec)} />

      {/* 5. Slide-over Right Cart Drawer */}
      <CartDrawer onNavigateToCart={() => handleNavigate('cart')} />

      {/* 6. 60-Second Interactive Judge Evaluation Tour Modal */}
      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        onNavigate={handleNavigate}
        onLoadPrompt={handleLoadDemoPrompt}
      />

      {/* 7. Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* 8. Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <BasketProvider>
      <AppContent />
    </BasketProvider>
  );
}

export default App;
