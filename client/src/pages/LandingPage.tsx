import React from 'react';
import { Sparkles, ShieldCheck, CreditCard, Terminal, ArrowRight, CheckCircle2, Bot, Lock, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onLoadDemoPrompt: (prompt: string) => void;
  onOpenJudgeTour?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onLoadDemoPrompt,
  onOpenJudgeTour,
}) => {
  const handleLaunchDemo = () => {
    onNavigate('ai-shopping');
    onLoadDemoPrompt(
      'I need a laptop for AI development under ₹80,000 with at least 16GB RAM and a dedicated GPU.'
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141413] space-y-24 pb-24 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-20 pb-12 max-w-6xl mx-auto px-6 sm:px-8 text-center">
        {/* Subtle Ambient Background Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#EBE7DE]/70 via-[#F3EFE6]/50 to-[#ECE6D8]/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow Track Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E2DDD3] bg-white/80 text-[#141413] shadow-xs backdrop-blur-sm mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#B88746]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] font-medium text-[#737069]">
              Razorpay AI Buildathon 2026 • Agentic Commerce Track
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-semibold tracking-[-0.03em] text-[#141413] leading-[1.08] max-w-4xl">
            Turn Every Conversation <br className="hidden sm:inline" />
            <span className="text-[#8C6D4F] font-serif italic font-normal">
              Into Verified Revenue.
            </span>
          </h1>

          {/* Narrative Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-[#737069] max-w-3xl leading-relaxed font-normal">
            AgentCart is an intelligent sales agent engineered to discover customer intent, negotiate high-margin bundle discounts, recommend verified upsells with explicit consent, and execute cryptographically secured <strong className="text-[#141413] font-medium">Razorpay Test Mode</strong> transactions under strict policy bounds.
          </p>

          {/* CTA Action Cluster */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            {onOpenJudgeTour && (
              <button
                type="button"
                onClick={onOpenJudgeTour}
                className="group relative flex items-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8C6D4F] to-[#694F36] hover:from-[#7A5E43] hover:to-[#57412C] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.16em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
                <span>⚡ Start 60s Judge Tour</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleLaunchDemo}
              className="flex items-center gap-2 px-6 py-4 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.16em] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              <span>Try AI Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('merchant')}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] font-medium text-xs uppercase tracking-[0.14em] shadow-xs transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Merchant Lab</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('audit')}
              className="flex items-center gap-1.5 px-4 py-4 rounded-xl bg-[#F4F2EC] hover:bg-[#EBE7DE] text-[#141413] border border-[#E8E5DD] font-mono text-[11px] font-medium transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-[#8C6D4F]" />
              <span>Audit Trail (AC-10492)</span>
            </button>
          </div>
        </motion.div>

        {/* 4 Editorial Trust & Financial Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 pt-10 border-t border-[#E8E5DD] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left"
        >
          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DD] shadow-xs transition-all hover:border-[#D8D4C8]">
            <div className="text-2xl font-mono font-semibold text-[#141413] tracking-tight">+33.1%</div>
            <div className="text-xs text-[#737069] mt-1 font-medium">Average Order Value (AOV)</div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D4F] block mt-2">Autonomous Upsell</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DD] shadow-xs transition-all hover:border-[#D8D4C8]">
            <div className="text-2xl font-mono font-semibold text-[#141413] tracking-tight">100% Gated</div>
            <div className="text-xs text-[#737069] mt-1 font-medium">Explicit Customer Consent</div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block mt-2">Zero Cart Traps</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DD] shadow-xs transition-all hover:border-[#D8D4C8]">
            <div className="text-2xl font-mono font-semibold text-[#141413] tracking-tight">HMAC-SHA256</div>
            <div className="text-xs text-[#737069] mt-1 font-medium">Server Signature Verify</div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 block mt-2">Cryptographic Gate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E5DD] shadow-xs transition-all hover:border-[#D8D4C8]">
            <div className="text-2xl font-mono font-semibold text-[#141413] tracking-tight">AC-XXXXX</div>
            <div className="text-xs text-[#737069] mt-1 font-medium">Immutable Audit Trail</div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#737069] block mt-2">Step-by-Step Policy</span>
          </div>
        </motion.div>
      </section>

      {/* 2. THE AGENTIC COMMERCE LIFECYCLE (3 PILLARS) */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-6 border-b border-[#E8E5DD]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#737069] font-medium block mb-2">
              Architecture & Lifecycle
            </span>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#141413] sm:text-4xl">
              The Agentic Commerce Lifecycle
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#737069] max-w-md">
            Moving beyond simple chat bots to end-to-end, bounded revenue execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-[#E8E5DD] bg-white p-7 shadow-xs space-y-4 transition-all hover:border-[#D0CBC0]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#737069] tracking-wider">01 —</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#141413]">
                <Cpu className="size-4" />
              </div>
            </div>
            <h3 className="font-semibold text-[#141413] text-lg tracking-tight">
              Understand & Rank
            </h3>
            <p className="text-xs leading-relaxed text-[#737069]">
              Extracts structured requirements (Budget, RAM, GPU, purpose) and deterministically scores catalog products with multi-factor weighted ranking.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#8C6D4F]">
              Deterministic Score Indices
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-[#E8E5DD] bg-white p-7 shadow-xs space-y-4 transition-all hover:border-[#D0CBC0] ring-1 ring-[#8C6D4F]/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#8C6D4F] tracking-wider">02 —</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#8C6D4F]">
                <Sparkles className="size-4" />
              </div>
            </div>
            <h3 className="font-semibold text-[#141413] text-lg tracking-tight">
              Consent-Driven Upsell
            </h3>
            <p className="text-xs leading-relaxed text-[#737069]">
              Detects high-margin warranties or complementary hardware, pitch-explains the utility, and requires explicit user confirmation before cart inclusion.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-700">
              Affirmative Customer Approval
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-[#E8E5DD] bg-white p-7 shadow-xs space-y-4 transition-all hover:border-[#D0CBC0]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#737069] tracking-wider">03 —</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#F4F2EC] text-[#141413]">
                <Lock className="size-4" />
              </div>
            </div>
            <h3 className="font-semibold text-[#141413] text-lg tracking-tight">
              Policy Check & Razorpay
            </h3>
            <p className="text-xs leading-relaxed text-[#737069]">
              Validates financial caps and inventory via the Financial Policy Engine, launches Razorpay Test Mode checkout, and cryptographically confirms payment.
            </p>
            <div className="pt-2 text-[11px] font-mono text-indigo-700">
              HMAC Server Verification
            </div>
          </div>
        </div>
      </section>

      {/* 3. FINANCIAL POLICY ENGINE & RAZORPAY INTEGRATION */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Financial Policy Engine */}
        <div className="rounded-3xl border border-[#E8E5DD] bg-white p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#8C6D4F] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Financial Policy Engine</span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-[#141413]">
            Bounded Autonomy with Hard Safeguards
          </h3>

          <p className="text-xs leading-relaxed text-[#737069]">
            The AI agent never possesses direct access to database credentials or payment keys. Every order must pass policy verification before gateway order creation:
          </p>

          <ul className="space-y-3 text-xs text-[#141413] font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-[#141413]">MAX_TRANSACTION_AMOUNT</strong>: Capped at ₹1,00,000 INR per checkout.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-[#141413]">MAX_DISCOUNT_PERCENT</strong>: Hard-limited to 15% to protect merchant margins.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-[#141413]">UPSELL_REQUIRES_CUSTOMER_APPROVAL</strong>: Eliminates hidden cart additions.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-mono text-[#141413]">PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION</strong>: Mandatory affirmative consent gate.
              </span>
            </li>
          </ul>
        </div>

        {/* Right: Razorpay Cryptographic Verification */}
        <div className="rounded-3xl border border-[#E8E5DD] bg-white p-8 sm:p-10 shadow-xs space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#141413] font-semibold">
              <CreditCard className="w-4 h-4 text-[#8C6D4F]" />
              <span>Razorpay Test Mode Integration</span>
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#141413]">
              Cryptographically Verified Payments
            </h3>

            <p className="mt-3 text-xs leading-relaxed text-[#737069]">
              Built strictly adhering to the Razorpay Test API standards. Frontend status is never trusted alone; orders transition to PAID only upon server-side HMAC-SHA256 signature verification.
            </p>
          </div>

          <div className="rounded-2xl bg-[#141413] text-[#FAF9F6] p-5 text-xs font-mono space-y-2 shadow-inner">
            <div className="text-[#8E8B82]">// Server Signature Verification</div>
            <div className="text-[#DCD8CE]">
              const sig = crypto.createHmac('sha256', secret)
            </div>
            <div className="text-[#DCD8CE]">
              &nbsp;&nbsp;.update(orderId + "|" + paymentId)
            </div>
            <div className="text-[#DCD8CE]">
              &nbsp;&nbsp;.digest('hex');
            </div>
            <div className="text-emerald-400 font-bold pt-1">
              return sig === clientSignature; // PASSED ✓
            </div>
          </div>
        </div>
      </section>

      {/* 4. 5-MINUTE DEMO RUNNER BANNER */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl border border-[#E8E5DD] bg-gradient-to-r from-[#F4F1EA] via-[#FAF9F6] to-[#ECE7DD] p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#737069] font-medium">
            Evaluation Walkthrough
          </span>

          <h3 className="text-3xl font-semibold text-[#141413] tracking-tight sm:text-4xl">
            Ready for the 5-Minute Buildathon Judge Demo?
          </h3>

          <p className="text-xs sm:text-sm text-[#737069] max-w-xl mx-auto leading-relaxed">
            Experience the complete flow: Natural language query $\rightarrow$ ASUS ROG recommendation $\rightarrow$ 2-year warranty upsell $\rightarrow$ Policy validation $\rightarrow$ Razorpay Test Mode checkout $\rightarrow$ Immutable audit log.
          </p>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#141413] px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] text-[#FAF9F6] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#262624] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              <Bot className="size-4" />
              <span>Start 5-Minute Demo Flow</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
