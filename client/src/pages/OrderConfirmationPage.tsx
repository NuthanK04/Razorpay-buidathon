import React, { useEffect } from 'react';
import { CheckCircle2, Terminal, ArrowRight, LayoutDashboard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderConfirmationPageProps {
  order: any;
  auditId?: string;
  onNavigate: (page: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  auditId,
  onNavigate,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-5">
        <p className="text-[#737069] text-xs">No active order details found.</p>
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="px-6 py-3.5 bg-[#141413] text-[#FAF9F6] rounded-xl text-xs font-medium uppercase tracking-wider shadow-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
      {/* Top Banner */}
      <div className="rounded-3xl p-8 sm:p-10 border border-[#E8E5DD] bg-white text-center space-y-5 shadow-xs relative overflow-hidden">
        <div className="size-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
          <CheckCircle2 className="size-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
            Payment Verified • Razorpay Test Mode
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-[#141413] mt-3">
            Order Confirmed & Verified
          </h1>
          <p className="text-xs sm:text-sm text-[#737069] mt-2 max-w-md mx-auto leading-relaxed">
            Order <strong className="text-[#141413] font-mono">#{order.orderNumber}</strong> has transitioned to{' '}
            <span className="text-emerald-700 font-bold font-mono">PAID</span> upon server-side cryptographic HMAC-SHA256 signature verification.
          </p>
        </div>

        {/* Audit Log Chip */}
        {auditId && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E5DD] text-xs font-mono text-[#141413]">
            <Terminal className="size-3.5 text-[#8C6D4F]" />
            <span className="text-[#737069]">Audit Trail Code:</span>
            <span className="font-bold text-[#141413]">{auditId}</span>
          </div>
        )}
      </div>

      {/* Order & Line Items Summary */}
      <div className="rounded-3xl p-8 border border-[#E8E5DD] bg-white shadow-xs space-y-6">
        <h3 className="font-semibold text-[#141413] text-lg">Transaction Receipt</h3>

        <div className="space-y-3 divide-y divide-[#E8E5DD] text-xs">
          {order.items?.map((item: any) => (
            <div key={item.id || item.productId} className="pt-3 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-[#141413]">{item.productName || 'Product'}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#737069]">Qty: {item.quantity}</span>
                  {item.isUpsell && (
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                      Approved Add-on (+₹{item.totalPrice?.toLocaleString('en-IN') || item.unitPrice?.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>
              </div>
              <span className="font-mono font-bold text-[#141413]">
                ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E5DD] text-xs font-mono space-y-1.5 text-[#737069]">
          <div className="flex justify-between">
            <span>Payment Gateway:</span>
            <span className="text-emerald-700 font-bold">RAZORPAY TEST MODE (PAID)</span>
          </div>
          <div className="flex justify-between">
            <span>Total Settled (INR):</span>
            <span className="text-[#141413] font-bold text-sm">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Post-Purchase Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={() => onNavigate('merchant')}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-wider shadow-xs transition-all hover:-translate-y-0.5"
        >
          <LayoutDashboard className="size-4" />
          <span>View Merchant Revenue Lab</span>
          <ArrowRight className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('audit')}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] font-medium text-xs uppercase tracking-wider shadow-xs transition-all"
        >
          <Terminal className="size-4 text-[#8C6D4F]" />
          <span>Inspect Audit Trail</span>
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
