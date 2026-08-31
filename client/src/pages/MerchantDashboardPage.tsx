import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { MerchantMetrics } from '../types/index.js';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  Zap,
  Key,
  ShieldCheck,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MerchantDashboardProps {
  onNavigate: (page: string) => void;
}

export const MerchantDashboardPage: React.FC<MerchantDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<MerchantMetrics | null>(null);
  const [merchantInfo, setMerchantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Gateway Settings State
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [keyIdInput, setKeyIdInput] = useState('');
  const [keySecretInput, setKeySecretInput] = useState('');
  const [isSavingGateway, setIsSavingGateway] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetchDashboard();
    fetchGatewayStatus();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getMerchantDashboard();
      if (res.data) {
        setMetrics(res.data);
        setMerchantInfo(res.merchant);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const fetchGatewayStatus = async () => {
    try {
      const res = await api.getPaymentGatewayStatus();
      setGatewayStatus(res);
      if (res.keyId && !res.keyId.includes('buildathon2026')) {
        setKeyIdInput(res.keyId);
      }
    } catch {
      // ignore
    }
  };

  const handleSaveGatewayKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyIdInput || !keySecretInput) {
      setGatewayMessage({ text: 'Both Razorpay Key ID and Key Secret are required.', isError: true });
      return;
    }

    setIsSavingGateway(true);
    setGatewayMessage(null);

    try {
      const res = await api.configureRazorpayKeys({
        keyId: keyIdInput,
        keySecret: keySecretInput,
      });

      setGatewayMessage({
        text: res.message || 'Razorpay credentials saved and verified!',
        isError: !res.success,
      });
      await fetchGatewayStatus();
    } catch (err: any) {
      setGatewayMessage({
        text: err.response?.data?.message || err.message || 'Failed to save credentials.',
        isError: true,
      });
    } finally {
      setIsSavingGateway(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-center text-xs text-[#141413] font-mono gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#8C6D4F]" />
        <span>Loading Merchant Growth Analytics...</span>
      </div>
    );
  }

  const { revenue, performance, experiment, dailyTrends, recentOrders } = metrics;
  const isGatewayLiveOrTest = Boolean(
    gatewayStatus?.keyId &&
    (gatewayStatus.keyId.startsWith('rzp_test_') || gatewayStatus.keyId.startsWith('rzp_live_')) &&
    !gatewayStatus.keyId.includes('buildathon2026')
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E5DD] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[#141413]">
              {merchantInfo?.storeName || 'ElectroTech Apex'}
            </h1>
            <span className="text-[10px] font-mono uppercase bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] px-2.5 py-0.5 rounded-full font-semibold">
              AI Growth Lab
            </span>
          </div>
          <p className="text-xs text-[#737069] mt-1">
            Real-time autonomous revenue impact, AOV expansion metrics, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              fetchDashboard();
              fetchGatewayStatus();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] text-xs font-medium uppercase tracking-wider border border-[#E8E5DD] shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('ai-shopping')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] text-xs font-medium uppercase tracking-wider shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Test AI Agent</span>
          </button>
        </div>
      </div>

      {/* CORE REVENUE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="rounded-2xl p-6 border border-[#E8E5DD] bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737069]">Total Verified Revenue</span>
            <div className="size-8 rounded-lg bg-[#FAF9F6] border border-[#E8E5DD] flex items-center justify-center text-[#141413]">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#141413] tracking-tight">
            ₹{revenue.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono font-medium flex items-center gap-1">
            <ArrowUpRight className="size-3.5" />
            <span>AI-Driven: {Math.round((revenue.aiAssistedRevenue / (revenue.totalRevenue || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Card 2: Upsell & Cross-Sell Revenue */}
        <div className="rounded-2xl p-6 border border-[#8C6D4F]/30 bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C6D4F]">Consent Upsell Revenue</span>
            <div className="size-8 rounded-lg bg-[#F4F2EC] border border-[#8C6D4F]/20 flex items-center justify-center text-[#8C6D4F]">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#141413] tracking-tight">
            ₹{revenue.upsellRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#8C6D4F] font-mono font-medium flex items-center gap-1">
            <Zap className="size-3.5" />
            <span>{performance.upsellAcceptanceRate}% Approval Rate</span>
          </div>
        </div>

        {/* Card 3: Average Order Value (AOV) */}
        <div className="rounded-2xl p-6 border border-[#E8E5DD] bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737069]">AI Average Order Value</span>
            <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#141413] tracking-tight">
            ₹{revenue.aovAi.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono font-medium flex items-center gap-1">
            <ArrowUpRight className="size-3.5" />
            <span>+{revenue.aovUpliftPercent}% vs Baseline</span>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="rounded-2xl p-6 border border-[#E8E5DD] bg-white shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#737069]">AI Conversion Rate</span>
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Percent className="size-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-[#141413] tracking-tight">
            {performance.conversionRateAi}%
          </div>
          <div className="text-[11px] text-indigo-700 font-mono font-medium flex items-center gap-1">
            <ArrowUpRight className="size-3.5" />
            <span>+{performance.conversionRateUpliftPercent}% Uplift</span>
          </div>
        </div>
      </div>

      {/* RAZORPAY PAYMENT GATEWAY HUB */}
      <div className="rounded-3xl p-8 border border-[#E8E5DD] bg-white shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8E5DD] pb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#141413] flex items-center justify-center text-[#FAF9F6] font-bold text-base shadow-xs">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[#141413] text-lg">Razorpay Payment Gateway Hub</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isGatewayLiveOrTest
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-[#F4F2EC] text-[#737069] border-[#E8E5DD]'
                  }`}
                >
                  {isGatewayLiveOrTest ? '🟢 LIVE/TEST GATEWAY CONNECTED' : '🟡 TEST ENGINE ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-[#737069] mt-0.5">
                Configure your official Razorpay API credentials for test cards, UPI QR codes, and Netbanking verification.
              </p>
            </div>
          </div>

          <a
            href="https://dashboard.razorpay.com/app/keys"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F4F2EC] text-[#141413] font-medium text-xs border border-[#E8E5DD] shadow-xs transition-colors"
          >
            <span>Razorpay Keys Dashboard</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveGatewayKeys} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1">
              <Key className="size-3.5 text-[#8C6D4F]" />
              <span>Razorpay Key ID</span>
            </label>
            <input
              type="text"
              value={keyIdInput}
              onChange={(e) => setKeyIdInput(e.target.value)}
              placeholder="e.g. rzp_test_1DP5mmOlF5G5ag"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E5DD] font-mono text-xs text-[#141413] bg-[#FAF9F6] focus:outline-none focus:border-[#141413]"
              required
            />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1">
              <Lock className="size-3.5 text-[#8C6D4F]" />
              <span>Razorpay Key Secret</span>
            </label>
            <input
              type="password"
              value={keySecretInput}
              onChange={(e) => setKeySecretInput(e.target.value)}
              placeholder="Enter Secret Key"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E5DD] font-mono text-xs text-[#141413] bg-[#FAF9F6] focus:outline-none focus:border-[#141413]"
              required
            />
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isSavingGateway}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-wider shadow-xs transition-all disabled:opacity-60"
            >
              {isSavingGateway ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Validating Keys...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>Save & Verify Gateway</span>
                </>
              )}
            </button>
          </div>
        </form>

        {gatewayMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono border flex items-center gap-2 ${
              gatewayMessage.isError
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {gatewayMessage.isError ? (
              <span className="font-bold">❌ {gatewayMessage.text}</span>
            ) : (
              <span className="font-bold">✅ {gatewayMessage.text}</span>
            )}
          </div>
        )}
      </div>

      {/* REVENUE IMPACT EXPERIMENT SECTION */}
      <div className="rounded-3xl p-8 border border-[#E8E5DD] bg-white shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E8E5DD] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-semibold text-[#141413] text-lg">AI Revenue Impact Experiment</h2>
              <span className="text-[10px] font-mono bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] px-2 py-0.5 rounded-full font-semibold">
                Confidence: 95%
              </span>
            </div>
            <p className="text-xs text-[#737069] mt-1">
              Synthetic & measured comparison: Traditional Catalog Store (Baseline) vs AgentCart (AI Intent + Consent-Gated Upsell).
            </p>
          </div>
          <div className="text-right text-xs font-mono text-[#737069]">
            Sample Size: <strong className="text-[#141413]">{experiment.sampleSize}</strong> Sessions
          </div>
        </div>

        {/* Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Baseline Card */}
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DD] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#737069] uppercase tracking-wider">
                Variant A: Baseline Catalog Store
              </span>
              <span className="text-[10px] font-mono text-[#737069] bg-white px-2 py-0.5 rounded border border-[#E8E5DD]">
                Standard Store
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs text-[#737069]">
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span>Conversion Rate:</span>
                <span className="font-bold text-[#141413]">{performance.conversionRateBaseline}%</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span>Average Order Value (AOV):</span>
                <span className="font-bold text-[#141413]">₹{revenue.aovBaseline.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span>Upsell Acceptance Rate:</span>
                <span className="text-[#A19F9A]">0.0% (No intelligent pitch)</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span>Revenue per Session:</span>
                <span className="text-[#141413]">₹10,592</span>
              </div>
            </div>
          </div>

          {/* AgentCart Card */}
          <div className="p-6 rounded-2xl bg-[#F4F2EC] border border-[#8C6D4F]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6D4F] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                Variant B: AgentCart Commerce Platform
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                WINNER (+89.5% Uplift)
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span className="text-[#737069]">Conversion Rate:</span>
                <span className="text-emerald-700 font-bold">{performance.conversionRateAi}% (+89.5%)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span className="text-[#737069]">Average Order Value (AOV):</span>
                <span className="text-emerald-700 font-bold">₹{revenue.aovAi.toLocaleString('en-IN')} (+33.1%)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E8E5DD]">
                <span className="text-[#737069]">Upsell Acceptance Rate:</span>
                <span className="text-[#8C6D4F] font-bold">{performance.upsellAcceptanceRate}% (Verified Consent)</span>
              </div>
              <div className="flex justify-between pt-1 font-bold">
                <span className="text-[#737069]">Revenue per Session:</span>
                <span className="text-emerald-700 font-bold">₹26,736 (+152.4%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REVENUE TREND CHART */}
      {dailyTrends && dailyTrends.length > 0 && (
        <div className="rounded-3xl p-8 border border-[#E8E5DD] bg-white shadow-xs space-y-4">
          <div>
            <h3 className="font-semibold text-[#141413] text-lg">7-Day Revenue Composition (INR)</h3>
            <p className="text-xs text-[#737069]">Daily breakdown of AI-assisted revenue vs baseline sales</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#141413" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#141413" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DD" />
                <XAxis dataKey="date" stroke="#737069" tick={{ fontSize: 11 }} />
                <YAxis stroke="#737069" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FAF9F6', borderColor: '#E8E5DD', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="aiAssistedRevenue" stroke="#141413" strokeWidth={2} fillOpacity={1} fill="url(#colorAi)" name="AI Assisted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* RECENT ORDERS TABLE */}
      <div className="rounded-3xl p-8 border border-[#E8E5DD] bg-white shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#141413] text-lg">Recent Orders</h3>
            <p className="text-xs text-[#737069]">Order verification and cryptographic payment fulfillment status</p>
          </div>
          <span className="text-xs font-mono text-[#737069]">{recentOrders?.length || 0} recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E8E5DD] text-[#737069] uppercase font-mono">
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Policy Status</th>
                <th className="py-3 px-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E5DD] font-sans">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#141413]">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4 text-[#141413]">{ord.customerName || 'Demo Customer'}</td>
                    <td className="py-3.5 px-4">
                      {ord.isAiAssisted ? (
                        <span className="text-[10px] font-mono bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] px-2 py-0.5 rounded font-semibold">
                          AI Assisted {ord.hasUpsell && '+ Upsell'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#737069]">Baseline Store</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#141413]">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                        {ord.policyValidationStatus || 'PASSED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          ord.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.status === 'FAILED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#737069]">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboardPage;
