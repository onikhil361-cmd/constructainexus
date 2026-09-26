import React from 'react';
import type { WorkflowResult } from '../types';
import { formatTimestamp, cn } from '../utils/formatters';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';

interface VerificationConsoleProps {
  result: WorkflowResult;
  isDemoMode?: boolean;
}

const CHECK_ITEMS = [
  { key: 'approval_valid', label: 'APPROVAL VALID' },
  { key: 'quantity_valid', label: 'QUANTITY VALID' },
  { key: 'action_valid', label: 'PROCUREMENT ACTION VALID' },
] as const;

export function VerificationConsole({ result, isDemoMode }: VerificationConsoleProps) {
  const isVerified = result.verification_status === 'VERIFIED';
  const isFailed = result.verification_status === 'FAILED';
  const isPending = !isVerified && !isFailed;

  // Determine which checks pass based on verification status and message
  const checks = CHECK_ITEMS.map(item => {
    if (isVerified) return { ...item, passed: true };
    if (isFailed) {
      // Try to detect which check failed from message
      const msg = (result.verification_message || '').toLowerCase();
      if (item.key === 'approval_valid' && (msg.includes('approval') || msg.includes('unauthorized'))) {
        return { ...item, passed: false };
      }
      if (item.key === 'quantity_valid' && (msg.includes('quantity') || msg.includes('amount'))) {
        return { ...item, passed: false };
      }
      if (item.key === 'action_valid' && (msg.includes('action') || msg.includes('procurement'))) {
        return { ...item, passed: false };
      }
      return { ...item, passed: true }; // assume passed if not specifically mentioned
    }
    return { ...item, passed: null }; // pending
  });

  return (
    <div className="glass-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center',
          isVerified ? 'bg-emerald-500/15 border border-emerald-500/20' :
          isFailed ? 'bg-red-500/15 border border-red-500/20' :
          'bg-graphite-800 border border-graphite-600'
        )}>
          <Shield size={18} className={isVerified ? 'text-emerald-400' : isFailed ? 'text-red-400' : 'text-graphite-400'} />
        </div>
        <div>
          <div className="section-label mb-0.5">VERIFICATION CONSOLE</div>
          <div className="text-sm font-bold text-white">Procurement Integrity Check</div>
        </div>
        {isDemoMode && (
          <span className="ml-auto text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded">DEMO</span>
        )}
      </div>

      {/* Check items */}
      <div className="space-y-2 mb-5">
        {checks.map(({ key, label, passed }) => (
          <div
            key={key}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm',
              passed === true
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                : passed === false
                ? 'bg-red-500/5 border-red-500/20 text-red-400'
                : 'bg-graphite-900 border-graphite-600 text-graphite-400'
            )}
          >
            {passed === true && <CheckCircle size={15} />}
            {passed === false && <XCircle size={15} />}
            {passed === null && <AlertTriangle size={15} className="opacity-50" />}
            {label}
          </div>
        ))}
      </div>

      {/* Final result */}
      <div className={cn(
        'flex items-center justify-center gap-3 py-4 rounded-xl border text-lg font-bold tracking-widest',
        isVerified
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : isFailed
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : 'bg-graphite-800 border-graphite-600 text-graphite-300'
      )}>
        {isVerified && <CheckCircle size={20} />}
        {isFailed && <XCircle size={20} />}
        {isPending && <AlertTriangle size={20} />}
        {isVerified ? 'VERIFIED' : isFailed ? 'VERIFICATION FAILED' : 'PENDING'}
      </div>

      {/* Message */}
      {result.verification_message !== 'N/A' && (
        <div className="mt-4 p-3 bg-graphite-900/60 rounded-lg border border-graphite-700/50">
          <div className="text-[10px] font-semibold tracking-widest text-graphite-300 uppercase mb-1.5">Verification Message</div>
          <p className="text-sm text-graphite-200">{result.verification_message}</p>
        </div>
      )}

      {/* Timestamp */}
      {result.verified_at !== 'N/A' && (
        <div className="mt-3 text-[10px] font-mono text-graphite-400">
          Verified at: {formatTimestamp(result.verified_at)}
        </div>
      )}
    </div>
  );
}
