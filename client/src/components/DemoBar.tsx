import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';

interface DemoBarProps {
  onLoadDemoPrompt: (prompt: string) => void;
  onNavigate: (page: string) => void;
  onOpenJudgeTour: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onLoadDemoPrompt, onNavigate, onOpenJudgeTour }) => {
  const [flags, setFlags] = useState<{
    simulatePaymentFailure: boolean;
    simulatePolicyViolation: boolean;
    simulateAiDown: boolean;
  }>({
    simulatePaymentFailure: false,
    simulatePolicyViolation: false,
    simulateAiDown: false,
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.getDemoStatus();
      if (res?.simulationFlags) {
        setFlags(res.simulationFlags);
      }
    } catch {
      // Fallback
    }
  };

  const toggleFlag = async (type: 'payment' | 'policy' | 'ai') => {
    setLoading(true);
    try {
      const currentVal =
        type === 'payment'
          ? flags.simulatePaymentFailure
          : type === 'policy'
          ? flags.simulatePolicyViolation
          : flags.simulateAiDown;

      const newVal = !currentVal;
      await api.toggleSimulation(type, newVal);
      setFlags((prev) => ({
        ...prev,
        [type === 'payment' ? 'simulatePaymentFailure' : type === 'policy' ? 'simulatePolicyViolation' : 'simulateAiDown']: newVal,
      }));

      setStatusMsg(`Simulation: ${type.toUpperCase()} is now ${newVal ? 'TRIGGERED' : 'DISABLED'}`);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch {
      setStatusMsg('Failed to update simulation flag.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoScenario = () => {
    onNavigate('ai-shopping');
    onLoadDemoPrompt('I need a laptop for AI development under ₹80,000 with at least 16GB RAM and a dedicated GPU.');
  };

  return (
    <div className="sticky top-0 z-50 bg-[#141413] text-[#FAF9F6] text-xs px-4 py-2 border-b border-[#262624] shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Buildathon Badge & Judge Tour Launch Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262624] border border-[#3A3835] text-[#FAF9F6] font-mono text-[10px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Razorpay AI Buildathon 2026</span>
          </div>

          <button
            type="button"
            onClick={onOpenJudgeTour}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#8C6D4F] to-[#694F36] hover:from-[#7A5E43] hover:to-[#57412C] text-[#FAF9F6] font-medium text-[11px] uppercase tracking-wider shadow-xs transition-all hover:scale-105"
            title="Start 60-Second Interactive Judge Evaluation Tour"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
            <span>⚡ 60s Judge Tour</span>
          </button>

          {statusMsg && (
            <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusMsg}
            </span>
          )}
        </div>

        {/* Right: Interactive 1-Click Demo Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Demo Script Trigger */}
          <button
            type="button"
            onClick={handleDemoScenario}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF9F6] hover:bg-[#EBE7DE] text-[#141413] font-medium text-xs shadow-xs transition-all"
            title="Load the primary 5-minute buildathon laptop evaluation prompt"
          >
            <Sparkles className="w-3 h-3 text-[#8C6D4F]" />
            <span>Load Demo Prompt (₹80k AI Laptop)</span>
          </button>

          {/* Simulate Payment Failure Toggle */}
          <button
            type="button"
            onClick={() => toggleFlag('payment')}
            disabled={loading}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              flags.simulatePaymentFailure
                ? 'bg-rose-900/80 text-rose-200 border border-rose-600 shadow-sm'
                : 'bg-[#262624] text-[#A19F9A] hover:bg-[#3A3835] border border-[#3A3835]'
            }`}
            title="Simulate Razorpay Gateway Outage / Failure Scenario"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Payment Failure: {flags.simulatePaymentFailure ? 'ON' : 'OFF'}</span>
          </button>

          {/* Simulate Policy Violation */}
          <button
            type="button"
            onClick={() => toggleFlag('policy')}
            disabled={loading}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              flags.simulatePolicyViolation
                ? 'bg-amber-900/80 text-amber-200 border border-amber-600 shadow-sm'
                : 'bg-[#262624] text-[#A19F9A] hover:bg-[#3A3835] border border-[#3A3835]'
            }`}
            title="Simulate Financial Policy Limit Violation"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Policy Violation: {flags.simulatePolicyViolation ? 'ON' : 'OFF'}</span>
          </button>

          {/* View Audit Trail */}
          <button
            type="button"
            onClick={() => onNavigate('audit')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#262624] hover:bg-[#3A3835] text-[#FAF9F6] border border-[#3A3835] transition-all font-mono text-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-[#8C6D4F]" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBar;
