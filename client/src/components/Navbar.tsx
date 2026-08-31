import React from 'react';
import { Bot, ShoppingCart, LayoutDashboard, ShieldCheck, Store, Sparkles, Search } from 'lucide-react';
import { AddToBasketTarget } from './motion-ui/add-to-basket';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount: number;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  cartItemCount,
  onOpenSearch,
}) => {
  return (
    <nav className="sticky top-[37px] z-40 border-b border-[#E8E5DD] px-6 py-3.5 bg-[#FAF9F6]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Editorial Title */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-[#141413] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Bot className="size-5 text-[#FAF9F6]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-lg tracking-[0.06em] text-[#141413]">
                AGENTCART
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] rounded-full font-medium">
                AI + RAZORPAY
              </span>
            </div>
            <p className="text-[11px] text-[#737069] font-mono -mt-0.5">
              Autonomous Growth & Policy Platform
            </p>
          </div>
        </div>

        {/* Center: Luxury Editorial Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#F4F2EC] p-1 rounded-xl border border-[#E8E5DD]">
          <button
            type="button"
            onClick={() => onNavigate('ai-shopping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.12em] font-medium transition-all ${
              currentPage === 'ai-shopping'
                ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                : 'text-[#737069] hover:text-[#141413] hover:bg-[#EBE7DE]'
            }`}
          >
            <Sparkles className="size-3.5 text-amber-400" />
            <span>AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.12em] font-medium transition-all ${
              currentPage === 'catalog'
                ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                : 'text-[#737069] hover:text-[#141413] hover:bg-[#EBE7DE]'
            }`}
          >
            <Store className="size-3.5" />
            <span>Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('merchant')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.12em] font-medium transition-all ${
              currentPage === 'merchant'
                ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                : 'text-[#737069] hover:text-[#141413] hover:bg-[#EBE7DE]'
            }`}
          >
            <LayoutDashboard className="size-3.5" />
            <span>Merchant Lab</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('audit')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs uppercase tracking-[0.12em] font-medium transition-all ${
              currentPage === 'audit'
                ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                : 'text-[#737069] hover:text-[#141413] hover:bg-[#EBE7DE]'
            }`}
          >
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Right: Search & Cart Button linked with AddToBasketTarget */}
        <div className="flex items-center gap-3">
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex size-10 items-center justify-center rounded-xl border border-[#E8E5DD] bg-white text-[#141413] hover:bg-[#F4F2EC] transition-all shadow-xs"
              aria-label="Search catalog"
            >
              <Search className="size-4" />
            </button>
          )}

          <AddToBasketTarget
            onClick={() => onNavigate('cart')}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] shadow-xs transition-all cursor-pointer"
            aria-label={`View cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="w-4 h-4 text-[#141413]" />
            <span className="text-xs uppercase tracking-[0.12em] font-medium hidden sm:inline">
              Basket
            </span>

            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  key={cartItemCount}
                  className="size-5 rounded-full bg-[#141413] text-[#FAF9F6] font-mono text-[10px] font-bold flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </AddToBasketTarget>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
