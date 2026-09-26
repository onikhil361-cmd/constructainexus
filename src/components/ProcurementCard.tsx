import React from 'react';
import type { WorkflowResult } from '../types';
import { RiskBadge } from './RiskBadge';
import { formatQuantity, cn } from '../utils/formatters';
import {
  ShoppingCart, User, Package, HelpCircle, Target,
  Truck, AlertOctagon,
} from 'lucide-react';

const ACTION_COLORS: Record<string, string> = {
  WAIT: 'text-graphite-300 border-graphite-600 bg-graphite-800',
  MONITOR: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  RESERVE_INVENTORY: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  REQUEST_QUOTE: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  ORDER_NOW: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  EXPEDITE: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  SWITCH_SUPPLIER: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  VALIDATE_MATERIAL: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  ESCALATE: 'text-red-400 border-red-500/30 bg-red-500/10',
  UNKNOWN: 'text-graphite-300 border-graphite-600 bg-graphite-800',
};

interface ProcurementCardProps {
  result: WorkflowResult;
  isDemoMode?: boolean;
}

export function ProcurementCard({ result, isDemoMode }: ProcurementCardProps) {
  const actionColor = ACTION_COLORS[result.recommended_action] || ACTION_COLORS.UNKNOWN;

  return (
    <div className="glass-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="section-label mb-1">PROCUREMENT INTELLIGENCE</div>
          <div className="text-lg font-bold text-white">{result.material}</div>
        </div>
        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded">DEMO</span>
          )}
          <RiskBadge level={result.risk_level} />
        </div>
      </div>

      {/* Recommended Action — prominent */}
      <div className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border mb-5', actionColor)}>
        <AlertOctagon size={18} />
        <div>
          <div className="text-[10px] font-semibold tracking-widest uppercase opacity-70 mb-0.5">Recommended Action</div>
          <div className="text-base font-bold tracking-wider">{result.recommended_action}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: 'Selected Supplier', value: result.selected_supplier, icon: Truck },
          { label: 'Quantity to Procure', value: formatQuantity(result.quantity_to_procure), icon: Package, mono: true },
          { label: 'Human Approval Required', value: typeof result.human_approval_required === 'boolean' ? (result.human_approval_required ? 'YES' : 'NO') : String(result.human_approval_required), icon: User },
          { label: 'Expected Result', value: result.expected_result, icon: Target },
        ].map(({ label, value, icon: Icon, mono }) => (
          <div key={label} className="bg-graphite-900/50 rounded-lg p-3 border border-graphite-700/50">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon size={12} className="text-graphite-400" />
              <span className="section-label text-[9px]">{label}</span>
            </div>
            <div className={cn('text-sm font-medium text-white', mono && 'font-mono text-cyan-400')}>
              {String(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Reason */}
      {result.reason !== 'N/A' && (
        <div className="bg-graphite-900/50 rounded-lg p-3 border border-graphite-700/50 mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <HelpCircle size={12} className="text-graphite-400" />
            <span className="section-label text-[9px]">Reason</span>
          </div>
          <p className="text-sm text-graphite-200 leading-relaxed">{result.reason}</p>
        </div>
      )}

      {/* Recommended next step */}
      {result.recommended_next_step !== 'N/A' && (
        <div className="pt-4 border-t border-graphite-700">
          <div className="section-label mb-1.5">Recommended Next Step</div>
          <p className="text-sm text-cyan-300">{result.recommended_next_step}</p>
        </div>
      )}
    </div>
  );
}
