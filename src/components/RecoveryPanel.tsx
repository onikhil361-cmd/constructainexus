import React from 'react';
import type { WorkflowResult } from '../types';
import { formatTimestamp, cn } from '../utils/formatters';
import { AlertOctagon, RefreshCw, Search, ArrowUp, FileText, ArrowDown } from 'lucide-react';

interface RecoveryPanelProps {
  result: WorkflowResult;
}

const RECOVERY_STEPS = [
  { id: 'failed', label: 'VERIFICATION FAILED', icon: AlertOctagon, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  { id: 'recovery', label: 'RECOVERY PROTOCOL', icon: RefreshCw, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { id: 'recheck', label: 'RECHECK SUPPLIER', icon: Search, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { id: 'reassess', label: 'REASSESS PROCUREMENT', icon: RefreshCw, color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
  { id: 'escalate', label: 'ESCALATE', icon: ArrowUp, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  { id: 'audit', label: 'AUDIT LOG', icon: FileText, color: 'text-graphite-300 border-graphite-600 bg-graphite-800' },
];

export function RecoveryPanel({ result }: RecoveryPanelProps) {
  const hasRecovery = result.recovery_status !== null && result.recovery_status !== undefined;

  return (
    <div className="glass-card p-6 border-red-500/20 animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
          <AlertOctagon size={18} className="text-red-400" />
        </div>
        <div>
          <div className="section-label text-red-400 mb-0.5">RECOVERY PROTOCOL</div>
          <div className="text-sm font-bold text-white">Verification Failure Recovery</div>
        </div>
      </div>

      {/* Recovery flow */}
      <div className="space-y-1 mb-5">
        {RECOVERY_STEPS.map((step, i) => (
          <div key={step.id}>
            <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs font-semibold tracking-wider', step.color)}>
              <step.icon size={14} />
              {step.label}
            </div>
            {i < RECOVERY_STEPS.length - 1 && (
              <div className="flex justify-start pl-4 py-0.5">
                <ArrowDown size={12} className="text-graphite-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Details */}
      {hasRecovery && (
        <div className="space-y-3 pt-4 border-t border-graphite-700">
          {[
            { label: 'Recovery Status', value: result.recovery_status },
            { label: 'Recovery Action', value: result.recovery_action },
          ].filter(({ value }) => value && value !== 'N/A').map(({ label, value }) => (
            <div key={label} className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
              <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase mb-1.5">{label}</div>
              <div className="text-sm font-mono text-white">{String(value)}</div>
            </div>
          ))}

          {result.recovery_message !== 'N/A' && (
            <div className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
              <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase mb-1.5">Recovery Message</div>
              <p className="text-sm text-graphite-200 leading-relaxed">{result.recovery_message}</p>
            </div>
          )}

          {result.recovery_timestamp !== 'N/A' && (
            <div className="text-[10px] font-mono text-graphite-400">
              Recovery at: {formatTimestamp(result.recovery_timestamp)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
