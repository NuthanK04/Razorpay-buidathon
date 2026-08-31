import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';
import { getProductImageUrl } from '@/utils/productImages';

interface CartDrawerProps {
  onNavigateToCart?: () => void;
  onCheckoutSuccess?: (order: any) => void;
}

export function CartDrawer({ onNavigateToCart }: CartDrawerProps) {
  const {
    items,
    totalQuantity,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromBasket,
  } = useBasket();

  const isRupee = subtotal >= 1000;
  const formatAmount = (val: number) =>
    isRupee ? `₹${val.toLocaleString('en-IN')}` : `£${val}`;

  const shippingThreshold = isRupee ? 5000 : 150;
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);

  const handleCheckout = () => {
    closeCart();
    if (onNavigateToCart) {
      onNavigateToCart();
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md border-l border-[#E8E5DD] bg-[#FAF9F6] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#E8E5DD] px-6 py-5 bg-white">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-[#141413]">
                    Your Basket
                  </h2>
                  <span className="font-mono text-xs text-[#737069]">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="flex size-9 items-center justify-center rounded-full text-[#737069] hover:bg-[#F4F2EC] hover:text-[#141413] focus:outline-none"
                  aria-label="Close basket drawer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {items.length > 0 && (
                <div className="border-b border-[#E8E5DD] bg-[#F4F2EC] px-6 py-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#737069]">
                      {remainingForFreeShipping > 0
                        ? `Add ${formatAmount(remainingForFreeShipping)} for free shipping`
                        : '✓ Free priority shipping unlocked'}
                    </span>
                    <span className="text-[#141413] font-semibold">
                      {formatAmount(subtotal)} / {formatAmount(shippingThreshold)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E5DD]">
                    <div
                      className="h-full bg-[#141413] transition-all duration-300"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="flex size-16 items-center justify-center rounded-full border border-[#E8E5DD] bg-white text-[#A19F9A] mb-4 shadow-xs">
                      <BasketOutlineIcon />
                    </div>
                    <h3 className="text-base font-medium text-[#141413]">
                      Your basket is empty.
                    </h3>
                    <p className="mt-2 max-w-xs text-xs text-[#737069] leading-relaxed">
                      Discover verified hardware and lifestyle pieces engineered with premium intention.
                    </p>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#141413] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#FAF9F6] shadow-xs transition-all hover:bg-[#262624]"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8E5DD]">
                    {items.map((item) => {
                      const price = item.unitPrice || item.product?.price || 0;
                      const pId: string = item.productId || item.product?.id || item.id || 'studio-tote';
                      const pName = item.product?.name || item.productId || 'Verified Item';

                      return (
                        <div key={pId} className="flex gap-4 py-4">
                          <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-[#E8E5DD] bg-white p-1.5">
                            <img
                              src={getProductImageUrl(item.product || { id: pId, name: pName })}
                              alt={pName}
                              className="size-full object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="text-sm font-semibold text-[#141413] leading-snug">
                                  {pName}
                                </h4>
                                <p className="text-xs text-[#737069] line-clamp-1 mt-0.5">
                                  {item.product?.description}
                                </p>
                              </div>
                              <span className="font-mono text-sm font-bold text-[#141413]">
                                {formatAmount(price * item.quantity)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center rounded-lg border border-[#E8E5DD] bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pId, item.quantity - 1)}
                                  className="flex size-7 items-center justify-center text-[#737069] hover:text-[#141413]"
                                  aria-label={`Decrease quantity of ${pName}`}
                                >
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-8 text-center font-mono text-xs text-[#141413] font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pId, item.quantity + 1)}
                                  className="flex size-7 items-center justify-center text-[#737069] hover:text-[#141413]"
                                  aria-label={`Increase quantity of ${pName}`}
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromBasket(pId)}
                                className="text-[#A19F9A] hover:text-rose-600 transition-colors p-1"
                                aria-label={`Remove ${pName} from basket`}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="border-t border-[#E8E5DD] bg-white p-6 space-y-4">
                  <div className="space-y-2 text-xs font-mono text-[#737069]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#141413]">
                        {formatAmount(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-[#141413]">
                        {subtotal >= shippingThreshold ? 'Free' : formatAmount(isRupee ? 150 : 15)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[#E8E5DD] pt-2 text-sm font-semibold text-[#141413]">
                      <span>Estimated Total</span>
                      <span className="font-bold text-base text-[#141413]">
                        {formatAmount(subtotal >= shippingThreshold ? subtotal : subtotal + (isRupee ? 150 : 15))}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#141413] hover:bg-[#262624] py-4 text-xs font-medium uppercase tracking-[0.16em] text-[#FAF9F6] shadow-sm transition-all active:scale-[0.99]"
                  >
                    <span>Proceed to Review & Pay</span>
                    <ArrowRight className="size-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="w-full text-center text-xs uppercase tracking-[0.14em] text-[#737069] hover:text-[#141413] transition-colors py-1"
                  >
                    Continue shopping
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#737069]">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>Razorpay Verified Gateway & Policy Guard</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function BasketOutlineIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
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

export default CartDrawer;
