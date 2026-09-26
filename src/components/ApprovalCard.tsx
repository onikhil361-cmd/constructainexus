import React from 'react';
import type { WorkflowResult } from '../types';
import { RiskBadge } from './RiskBadge';
import { formatDate, formatQuantity, cn } from '../utils/formatters';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ApprovalCardProps {
  result: WorkflowResult;
  isDemoMode?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export function ApprovalCard({ result, isDemoMode, onApprove, onReject, showActions = false }: ApprovalCardProps) {
  const approvalStatus = result.approval_status;
  const isApproved = approvalStatus === 'APPROVED';
  const isRejected = approvalStatus === 'REJECTED';
  const isPending = approvalStatus === 'PENDING' || approvalStatus === 'UNKNOWN';

  return (
    <div className="glass-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="section-label mb-1">APPROVAL REVIEW</div>
          <div className="text-base font-bold text-white">{result.material}</div>
        </div>
        <RiskBadge level={result.risk_level} />
      </div>

      {/* Prototype notice */}
      <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg mb-5">
        <Info size={13} className="text-violet-400 flex-shrink-0" />
        <p className="text-[11px] text-violet-300">
          <span className="font-semibold">PROTOTYPE APPROVAL SIMULATION</span>
          {' — '}This workflow uses simulated approval. No real purchase order is placed.
        </p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Required', value: formatQuantity(result.required_quantity) },
          { label: 'Available', value: formatQuantity(result.available_quantity) },
          { label: 'Shortage', value: formatQuantity(result.shortage_quantity) },
          { label: 'Required By', value: formatDate(result.required_by) },
          { label: 'Recommended Action', value: result.recommended_action },
          { label: 'Supplier', value: result.selected_supplier },
        ].map(({ label, value }) => (
          <div key={label} className="bg-graphite-900/50 rounded-lg p-3 border border-graphite-700/50">
            <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase mb-1">{label}</div>
            <div className="text-sm font-medium text-white font-mono">{String(value)}</div>
          </div>
        ))}
      </div>

      {/* Approval status */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border mb-4',
        isApproved ? 'bg-emerald-500/10 border-emerald-500/30' :
        isRejected ? 'bg-red-500/10 border-red-500/30' :
        'bg-graphite-800 border-graphite-600'
      )}>
        {isApproved
          ? <CheckCircle size={18} className="text-emerald-400" />
          : isRejected
          ? <XCircle size={18} className="text-red-400" />
          : <AlertTriangle size={18} className="text-amber-400" />
        }
        <div>
          <div className="text-[10px] font-semibold tracking-widest uppercase text-graphite-300 mb-0.5">Approval Status</div>
          <div className={cn(
            'text-sm font-bold tracking-wider',
            isApproved ? 'text-emerald-400' : isRejected ? 'text-red-400' : 'text-amber-400'
          )}>
            {result.approval_decision !== 'N/A' ? result.approval_decision : approvalStatus}
          </div>
        </div>
        {isDemoMode && (
          <span className="ml-auto text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded">SIMULATED</span>
        )}
      </div>

      {result.approved_by !== 'N/A' && (
        <div className="text-xs text-graphite-300 mb-4">
          Approved by: <span className="font-mono text-cyan-400">{result.approved_by}</span>
        </div>
      )}

      {/* Action buttons (prototype review) */}
      {showActions && isPending && (
        <div className="flex gap-3 mt-4 pt-4 border-t border-graphite-700">
          {onApprove && (
            <button onClick={onApprove} className="btn-success flex-1 justify-center">
              <CheckCircle size={15} />
              APPROVE
            </button>
          )}
          {onReject && (
            <button onClick={onReject} className="btn-danger flex-1 justify-center">
              <XCircle size={15} />
              REJECT / REASSESS
            </button>
          )}
        </div>
      )}
    </div>
  );
}
