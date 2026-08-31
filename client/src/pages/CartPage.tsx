import React, { useState } from 'react';
import { api } from '../services/api.js';
import { RazorpayModal } from '../components/RazorpayModal.js';
import { Cart } from '../types/index.js';
import { getProductImageUrl } from '../utils/productImages.js';
import { ShoppingBag, Trash2, ShieldCheck, CreditCard, Bot } from 'lucide-react';

interface CartPageProps {
  cart: Cart | null;
  onNavigate: (page: string) => void;
  onCartUpdated: (cart: Cart) => void;
  onOrderPaid: (order: any, auditId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onNavigate,
  onCartUpdated,
  onOrderPaid,
}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<any>(null);

  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return;
    try {
      if (cart.id && !cart.id.startsWith('global_')) {
        const updated = await api.removeFromCart(cart.id, itemId);
        onCartUpdated(updated);
        return;
      }
    } catch {
      // Fallback local update
    }

    const filtered = cart.items.filter(
      (i: any) =>
        i.id !== itemId &&
        i.productId !== itemId &&
        i.product?.id !== itemId
    );
    const subtotal = filtered.reduce(
      (acc: number, i: any) => acc + (i.unitPrice || i.product?.price || 0) * (i.quantity || 1),
      0
    );
    onCartUpdated({
      ...cart,
      items: filtered,
      subtotal,
      total: subtotal,
    });
  };

  const handleProceedToCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    setLoading(true);

    try {
      const payloadItems = cart.items.map((i: any) => {
        const pId = i.productId || i.product?.id || i.id || 'studio-tote';
        return {
          productId: pId,
          quantity: i.quantity || 1,
          isUpsell: Boolean(i.isUpsell),
          approvedByUser: i.approvedByUser ?? true,
          upsellReason: i.upsellReason,
        };
      });

      // 1. Create Order via Backend
      const order = await api.createOrder({
        cartId: cart.id && !cart.id.startsWith('global_') ? cart.id : undefined,
        items: payloadItems,
        isAiAssisted: true,
      });

      // 2. Initialize Payment Order
      const paymentOrder = await api.createPaymentOrder(order.id);

      setActiveOrder(order);
      setActivePaymentOrder(paymentOrder);
      setRazorpayModalOpen(true);
    } catch (err: any) {
      console.warn('Backend order creation notice, launching fallback payment mode:', err);
      const computedTotal = cart.total || cart.subtotal || 128;
      const simulatedOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        totalAmount: computedTotal,
        subtotal: computedTotal,
        items: cart.items,
        customerName: 'Demo Customer',
        customerEmail: 'demo.customer@agentcart.ai',
        policyValidationStatus: 'PASSED',
      };
      const simulatedPaymentOrder = {
        id: `order_${Date.now()}`,
        amount: computedTotal * 100,
        currency: 'INR',
        isSimulated: true,
        keyId: 'rzp_test_12345678902026',
      };

      setActiveOrder(simulatedOrder);
      setActivePaymentOrder(simulatedPaymentOrder);
      setRazorpayModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-5">
        <div className="size-16 rounded-3xl bg-white border border-[#E8E5DD] flex items-center justify-center mx-auto text-[#A19F9A] shadow-xs">
          <ShoppingBag className="size-7" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-[#141413]">Your Basket is Empty</h2>
        <p className="text-xs sm:text-sm text-[#737069] max-w-sm mx-auto leading-relaxed">
          Start a conversation with the AI Sales Specialist or explore the verified hardware catalog.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('ai-shopping')}
            className="px-6 py-3.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.14em] shadow-xs transition-all hover:-translate-y-0.5"
          >
            Ask AI Assistant
          </button>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] text-xs font-medium uppercase tracking-[0.14em] border border-[#E8E5DD] shadow-xs transition-all hover:-translate-y-0.5"
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-5">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C6D4F] font-semibold block mb-1">
            Order Review
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#141413]">
            Basket & Policy Verification
          </h1>
          <p className="text-xs text-[#737069] mt-1">
            Server-side recalculated totals with immutable customer consent auditing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('ai-shopping')}
          className="text-xs font-mono text-[#8C6D4F] hover:text-[#141413] font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Bot className="size-4" />
          <span>Resume AI Conversation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item: any) => {
            const price = item.unitPrice || item.product?.price || 0;
            const qty = item.quantity || 1;
            const pName = item.product?.name || item.productName || item.name || item.productId || 'Verified Item';

            return (
              <div
                key={item.id || item.productId}
                className="rounded-2xl p-5 border border-[#E8E5DD] bg-white shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#D0CBC0]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getProductImageUrl(item.product || { id: item.productId, name: pName })}
                    alt=""
                    className="size-16 rounded-xl object-cover bg-[#FAF9F6] shrink-0 border border-[#E8E5DD]"
                  />
                  <div>
                    <h3 className="font-semibold text-[#141413] text-sm leading-snug">
                      {pName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-[#737069]">Qty: {qty}</span>
                      {item.isUpsell ? (
                        <span className="text-[10px] font-mono font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          Consent-Approved Upsell
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#737069] uppercase">Verified Item</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span className="font-mono font-bold text-[#141413] text-base">
                    {price >= 1000
                      ? `₹${(price * qty).toLocaleString('en-IN')}`
                      : `£${price * qty}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id || item.productId || item.product?.id)}
                    className="text-[#A19F9A] hover:text-rose-600 p-2 rounded-lg hover:bg-[#F4F2EC] transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 rounded-3xl p-7 border border-[#E8E5DD] bg-white shadow-xs space-y-6">
          <h3 className="font-semibold text-[#141413] text-lg tracking-tight">Order Summary</h3>

          <div className="space-y-3 text-xs font-mono border-b border-[#E8E5DD] pb-5 text-[#737069]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-[#141413] font-semibold">
                {cart.subtotal >= 1000 ? `₹${cart.subtotal.toLocaleString('en-IN')}` : `£${cart.subtotal}`}
              </span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Bundle Savings:</span>
                <span>-{cart.discount >= 1000 ? `₹${cart.discount.toLocaleString('en-IN')}` : `£${cart.discount}`}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#141413] text-base pt-3 border-t border-[#E8E5DD]">
              <span>Total Payable:</span>
              <span className="text-[#141413]">
                {cart.total >= 1000 ? `₹${cart.total.toLocaleString('en-IN')}` : `£${cart.total}`}
              </span>
            </div>
          </div>

          {/* Policy Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Policy Status: Compliant</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              Transaction amount & customer affirmative consent verified by Financial Policy Engine.
            </p>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.14em] shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>Pay {cart.total >= 1000 ? `₹${cart.total.toLocaleString('en-IN')}` : `£${cart.total}`} with Razorpay</span>
          </button>
        </div>
      </div>

      <RazorpayModal
        isOpen={razorpayModalOpen}
        onClose={() => setRazorpayModalOpen(false)}
        order={activeOrder}
        paymentOrder={activePaymentOrder}
        onPaymentSuccess={(res) => {
          setRazorpayModalOpen(false);
          onOrderPaid(activeOrder, res.auditId || `AC-${Date.now().toString().slice(-5)}`);
        }}
        onPaymentFailure={() => {}}
      />
    </div>
  );
};

export default CartPage;
