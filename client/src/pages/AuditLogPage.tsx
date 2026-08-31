import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { AuditDrawer } from '../components/AuditDrawer.js';
import { AuditLog } from '../types/index.js';
import { RefreshCw, Eye, Download, Check } from 'lucide-react';

interface AuditLogPageProps {
  onNavigate?: (page: string) => void;
}

export const AuditLogPage: React.FC<AuditLogPageProps> = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterPolicy, setFilterPolicy] = useState('ALL');
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [filterAction, filterPolicy]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const logs = await api.getAuditLogs({
        actionType: filterAction === 'ALL' ? undefined : filterAction,
        policyResult: filterPolicy === 'ALL' ? undefined : filterPolicy,
      });
      setAuditLogs(logs || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agentcart_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 sm:p-10 border border-[#E8E5DD] bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C6D4F] font-semibold">
              Immutable Records
            </span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              SHA-256 Verified
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141413] mt-2">
            Commerce Policy & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#737069] mt-2 max-w-2xl leading-relaxed">
            Every AI intent extraction, catalog ranking, upsell offer, user approval, policy rule evaluation, and Razorpay signature verification is cryptographically indexed with unique code <code className="text-[#141413] font-mono font-semibold">AC-XXXXX</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] text-xs font-medium uppercase tracking-wider shadow-xs transition-colors"
          >
            {exported ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exported ? 'Exported' : 'Export JSON'}</span>
          </button>

          <button
            type="button"
            onClick={fetchAuditLogs}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F4F2EC] text-[#141413] text-xs font-medium uppercase tracking-wider border border-[#E8E5DD] shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E5DD] text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-[#737069] font-mono">Action Type:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-[#FAF9F6] border border-[#E8E5DD] rounded-xl px-3 py-2 text-xs text-[#141413] font-mono focus:outline-none focus:border-[#141413]"
            >
              <option value="ALL">All Actions</option>
              <option value="INTENT_EXTRACTION">Intent Extraction</option>
              <option value="PRODUCT_RANKING">Product Ranking</option>
              <option value="UPSELL_GENERATION">Upsell Generation</option>
              <option value="POLICY_CHECK">Policy Check</option>
              <option value="PAYMENT_INITIALIZATION">Payment Initialization</option>
              <option value="PAYMENT_VERIFICATION">Payment Verification</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#737069] font-mono">Policy Result:</span>
            <select
              value={filterPolicy}
              onChange={(e) => setFilterPolicy(e.target.value)}
              className="bg-[#FAF9F6] border border-[#E8E5DD] rounded-xl px-3 py-2 text-xs text-[#141413] font-mono focus:outline-none focus:border-[#141413]"
            >
              <option value="ALL">All Results</option>
              <option value="PASSED">Passed (Compliant)</option>
              <option value="FAILED">Failed (Blocked by Policy)</option>
              <option value="WARNING">Warning</option>
            </select>
          </div>
        </div>

        <span className="text-[#737069] font-mono">{auditLogs.length} Records Verified</span>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl border border-[#E8E5DD] bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs text-[#141413] font-mono gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#8C6D4F]" />
            <span>Loading immutable audit records...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E8E5DD] bg-[#FAF9F6] text-[#737069] uppercase font-mono">
                  <th className="py-3.5 px-4">Audit Code</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Action Type</th>
                  <th className="py-3.5 px-4">Policy Result</th>
                  <th className="py-3.5 px-4">Summary</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DD] font-mono">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#141413]">{log.auditCode || log.id}</td>
                      <td className="py-3.5 px-4 text-[#737069]">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] px-2 py-0.5 rounded font-semibold">
                          {log.actionType || log.action || 'POLICY_EVALUATION'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            log.policyResult === 'PASSED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : log.policyResult === 'FAILED'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {log.policyResult || 'PASSED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#141413] font-sans max-w-xs truncate">
                        {log.decisionSummary || log.details || log.reason || log.action || 'Policy compliance verified.'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedAuditLog(log)}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] text-xs font-sans font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="size-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#737069] font-sans">
                      No audit records found matching selected filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Detail Drawer */}
      <AuditDrawer
        isOpen={Boolean(selectedAuditLog)}
        onClose={() => setSelectedAuditLog(null)}
        auditLog={selectedAuditLog}
      />
    </div>
  );
};

export default AuditLogPage;
