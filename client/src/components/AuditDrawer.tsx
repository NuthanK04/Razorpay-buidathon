import React, { useState } from 'react';
import { AuditLog } from '../types/index.js';
import { X, ShieldCheck, ShieldAlert, Terminal, Copy, Check } from 'lucide-react';

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditLog: AuditLog | null;
}

export const AuditDrawer: React.FC<AuditDrawerProps> = ({ isOpen, onClose, auditLog }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !auditLog) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(auditLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPassed = auditLog.policyResult === 'PASSED';
  const isSuccess = auditLog.executionResult === 'SUCCESS';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-mono font-bold text-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-base">{auditLog.auditCode}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                    isPassed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {auditLog.policyResult}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(auditLog.timestamp).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Action & Tool */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Action Type</span>
              <p className="font-mono font-bold text-indigo-600 mt-1">{auditLog.actionType}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Bound Tool</span>
              <p className="font-mono font-semibold text-slate-800 mt-1">{auditLog.toolName || 'N/A'}</p>
            </div>
          </div>

          {/* Decision Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              AI / System Decision
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{auditLog.decisionSummary}</p>
          </div>

          {/* Input Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              Input Context
            </span>
            <p className="text-slate-700 font-mono leading-relaxed">{auditLog.inputSummary}</p>
          </div>

          {/* Reason & Explainability */}
          {auditLog.reason && (
            <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-[11px]">
                {isPassed ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                <span>Safety & Policy Rationale</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">{auditLog.reason}</p>
            </div>
          )}

          {/* Status & Execution */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Execution Status</span>
              <p className={`font-mono font-bold mt-1 ${isSuccess ? 'text-emerald-700' : 'text-rose-700'}`}>
                {auditLog.executionResult}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Log Immutability</span>
              <p className="font-mono text-slate-700 font-medium mt-1">COMMITTED (SHA256)</p>
            </div>
          </div>

          {/* Raw JSON viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Raw Audit Event Payload
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-mono font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-48 shadow-xs">
              {JSON.stringify(auditLog, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
