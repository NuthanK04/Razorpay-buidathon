import { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { AddToBasketTarget } from './motion-ui/add-to-basket';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
}

export function Header({ onNavigateSection, onOpenSearch, onOpenAccount }: HeaderProps) {
  const { totalQuantity, openCart, headerBasketRef } = useBasket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', id: 'featured-essentials' },
    { name: 'Collections', id: 'collection-story' },
    { name: 'New Arrivals', id: 'featured-essentials' },
    { name: 'Essentials', id: 'featured-essentials' },
    { name: 'About', id: 'brand-story' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-left focus:outline-none"
            aria-label="Atelier Home"
          >
            <span className="font-sans text-xl font-bold tracking-[0.25em] text-foreground transition-opacity group-hover:opacity-80">
              ATELIER
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Right: Actions (Search, Account, Basket) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Search products"
          >
            <Search className="size-[18px]" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onOpenAccount}
            className="flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="User Account"
          >
            <User className="size-[18px]" strokeWidth={1.75} />
          </button>

          <div className="relative">
            <AddToBasketTarget
              ref={headerBasketRef}
              onClick={openCart}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openCart();
                }
              }}
              aria-label={`View basket with ${totalQuantity} items`}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:bg-muted"
            >
              <BasketIcon />
              
              <AnimatePresence>
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    key={totalQuantity}
                    className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 font-mono text-[10px] font-semibold text-background shadow-sm"
                  >
                    {totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </AddToBasketTarget>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-full text-foreground/80 md:hidden hover:bg-muted"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-border bg-background px-6 py-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="flex items-center justify-between py-2 text-left text-sm uppercase tracking-[0.14em] text-foreground transition-colors hover:text-muted-foreground"
                >
                  <span>{link.name}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
              ))}
              <div className="mt-4 border-t border-border pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Free shipping on all UK & EU orders</span>
                <span className="font-mono">2026 EDITION</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function BasketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 11-1 9" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
      <path d="M4.5 15.5h15" />
      <path d="m5 11 4-7" />
      <path d="m9 11 1 9" />
    </svg>
  );
}
export default Header;
