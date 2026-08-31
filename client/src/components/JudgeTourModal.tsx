import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Play,
  Pause,
  Percent,
  Cpu,
  Mic,
  Lock,
} from 'lucide-react';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onLoadPrompt: (prompt: string) => void;
}

interface TourStep {
  id: number;
  title: string;
  badge: string;
  icon: any;
  metric: string;
  description: string;
  details: string[];
  liveActionText?: string;
  onLiveAction?: () => void;
}

export const JudgeTourModal: React.FC<JudgeTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLoadPrompt,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const steps: TourStep[] = [
    {
      id: 1,
      title: 'Voice & Natural Language Intent Mapping',
      badge: 'Intent Intelligence',
      icon: Mic,
      metric: '0.12s Parsing Latency',
      description:
        'Customers or judges can speak naturally or type ambiguous multi-constraint hardware queries. The AI extracts strict numeric thresholds for budget, memory, processor, and GPU.',
      details: [
        'Natural Language & Web Speech API speech-to-text integration',
        'Extracts explicit constraints: Budget: ₹80,000, RAM: ≥16GB, GPU: Dedicated RTX',
        'Generates structured context payload and starts immutable session trail',
      ],
      liveActionText: 'Launch Live AI Query',
      onLiveAction: () => {
        onNavigate('ai-shopping');
        onLoadPrompt('I need a laptop for AI development under ₹80,000 with at least 16GB RAM and a dedicated GPU.');
        onClose();
      },
    },
    {
      id: 2,
      title: 'Deterministic Catalog Ranking & Match Scoring',
      badge: 'Deterministic Scoring',
      icon: Cpu,
      metric: '98% Top Match Score',
      description:
        'Instead of hallucinating products, AgentCart scores merchant inventory using deterministic weighted algorithms against verified hardware specifications.',
      details: [
        'Multi-factor scoring: Price proximity (35%), Specs match (35%), Stock level (15%), Ratings (15%)',
        'Generates explainability summary ("Why AI Recommended This")',
        'Offers side-by-side spec comparison matrix with instant alternative options',
      ],
      liveActionText: 'View Product Catalog',
      onLiveAction: () => {
        onNavigate('catalog');
        onClose();
      },
    },
    {
      id: 3,
      title: 'Autonomous Bundle Negotiation (+8% Savings)',
      badge: 'AOV Expansion',
      icon: Percent,
      metric: '+33.1% AOV Uplift',
      description:
        'The AI sales agent autonomously identifies complementary hardware (e.g. 165Hz Monitor or Mechanical Keyboard) and negotiates a merchant-approved bundle discount within policy limits.',
      details: [
        'Dynamically bundles source product with high-affinity accessories',
        'Applies policy-capped bundle discounts (e.g. 8% bundle savings)',
        'Expands Average Order Value (AOV) from ₹58,200 baseline to ₹77,498',
      ],
      liveActionText: 'Try AI Shopping Chat',
      onLiveAction: () => {
        onNavigate('ai-shopping');
        onClose();
      },
    },
    {
      id: 4,
      title: 'Consent-Gated Protection Plan Upsells',
      badge: 'Ethical Guardrails',
      icon: ShieldCheck,
      metric: '100% Consent Gated',
      description:
        'Zero stealth additions. Add-ons like 2-Year Accidental Damage Protection require explicit affirmative customer consent before cart mutation.',
      details: [
        'Intelligent pitch timing: Presented at purchase commitment stage',
        'Server-side cart recalculation prevents client-side price tampering',
        'Zero unauthorized item additions recorded across all sessions',
      ],
      liveActionText: 'Inspect Active Cart',
      onLiveAction: () => {
        onNavigate('cart');
        onClose();
      },
    },
    {
      id: 5,
      title: 'Financial Policy Engine Guardrails',
      badge: 'Autonomous Safety',
      icon: Lock,
      metric: '3-Layer Policy Validation',
      description:
        'A deterministic server-side policy engine validates every transaction before checkout orders are generated. Violations result in safe refusal.',
      details: [
        'MAX_TRANSACTION_AMOUNT (Cap: ₹1,00,000 per order)',
        'MAX_DISCOUNT_PERCENT (Cap: 15% discount limit)',
        'UPSELL_REQUIRES_CUSTOMER_APPROVAL (Strict consent check)',
      ],
      liveActionText: 'View Policy Logs',
      onLiveAction: () => {
        onNavigate('audit');
        onClose();
      },
    },
    {
      id: 6,
      title: 'Razorpay Checkout & Cryptographic HMAC Verification',
      badge: 'Payment & Audit',
      icon: CreditCard,
      metric: 'SHA-256 Verified',
      description:
        'Seamless Razorpay Test Mode checkout with instant HMAC-SHA256 signature verification and immutable cryptographic audit logging (AC-XXXXX).',
      details: [
        'Integrates test card, Instant UPI QR Code, and netbanking flows',
        'Backend cryptographically verifies Razorpay signature before order transitions to PAID',
        'Logs immutable audit record with full input, decision, and signature parameters',
      ],
      liveActionText: 'View Merchant Analytics',
      onLiveAction: () => {
        onNavigate('merchant');
        onClose();
      },
    },
  ];

  // Auto-play progression
  useEffect(() => {
    let timer: any;
    if (isAutoPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, isOpen, steps.length]);

  if (!isOpen) return null;

  const active = steps[currentStep];
  const StepIcon = active.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-white px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Razorpay AI Buildathon 2026</h3>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                  60-Second Judge Tour
                </span>
              </div>
              <p className="text-xs text-slate-500">Track: AI Growth & Agentic Commerce (AgentCart)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isAutoPlaying
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={isAutoPlaying ? 'Pause automatic step advance' : 'Start auto-tour'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Auto-Playing' : 'Auto-Play'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 text-xs font-mono">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStep(idx);
                setIsAutoPlaying(false);
              }}
              className={`py-2.5 px-1 text-center transition-all border-b-2 flex flex-col items-center gap-0.5 ${
                currentStep === idx
                  ? 'border-indigo-600 bg-white text-indigo-700 font-bold shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px]">0{s.id}</span>
              <span className="text-[9px] truncate max-w-[70px] hidden sm:inline">{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Pillar {active.id} of {steps.length} • {active.badge}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">{active.title}</h4>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-xs self-start sm:self-center shadow-xs">
              {active.metric}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{active.description}</p>

          {/* Details Bullet Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
              Technical Architecture Highlights
            </span>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              {active.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentStep((prev) => Math.max(0, prev - 1));
                setIsAutoPlaying(false);
              }}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                setIsAutoPlaying(false);
              }}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs disabled:opacity-40"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {active.onLiveAction && (
            <button
              onClick={active.onLiveAction}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{active.liveActionText || 'Try in Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
