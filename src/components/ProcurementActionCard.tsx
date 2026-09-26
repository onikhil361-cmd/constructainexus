import React from 'react';
import type { WorkflowResult } from '../types';
import { formatTimestamp, formatQuantity, cn } from '../utils/formatters';
import { CheckCircle, XCircle, Package, ShoppingCart, Truck } from 'lucide-react';

interface ProcurementActionCardProps {
  result: WorkflowResult;
  isDemoMode?: boolean;
}

export function ProcurementActionCard({ result, isDemoMode }: ProcurementActionCardProps) {
  const isSimulated = result.procurement_status?.toLowerCase().includes('simulat') ||
                      result.procurement_action?.toLowerCase().includes('simulat');

  const statusColor = result.procurement_status?.toLowerCase().includes('fail')
    ? 'text-red-400 bg-red-500/10 border-red-500/30'
    : result.procurement_status?.toLowerCase().includes('complete')
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="glass-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="section-label mb-1">PROCUREMENT ACTION</div>
          <div className="text-xs font-mono text-graphite-300 mt-0.5">Transaction Record</div>
        </div>
        {(isSimulated || isDemoMode) && (
          <span className="text-[9px] font-semibold tracking-widest text-violet-400 border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 rounded-full">
            SIMULATED · PROTOTYPE
          </span>
        )}
      </div>

      {/* Procurement action badge */}
      <div className="bg-graphite-900 border border-graphite-600 rounded-xl p-4 mb-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
          <ShoppingCart size={18} className="text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold tracking-widest text-graphite-300 uppercase mb-0.5">Action</div>
          <div className="text-base font-bold font-mono text-white truncate">
            {result.procurement_action !== 'N/A' ? result.procurement_action : 'PENDING'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Package size={11} className="text-graphite-400" />
            <span className="section-label text-[9px]">Quantity</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {formatQuantity(result.procurement_quantity)}
            <span className="text-xs ml-1 text-graphite-400">units</span>
          </div>
        </div>

        <div className={cn('rounded-lg p-3 border', statusColor)}>
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle size={11} />
            <span className="text-[9px] font-semibold tracking-widest uppercase opacity-70">Status</span>
          </div>
          <div className="text-sm font-bold font-mono">
            {result.procurement_status !== 'N/A' ? result.procurement_status : 'PENDING'}
          </div>
        </div>

        <div className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Truck size={11} className="text-graphite-400" />
            <span className="section-label text-[9px]">Supplier Status</span>
          </div>
          <div className="text-sm font-mono text-white">
            {result.supplier_status !== 'N/A' ? result.supplier_status : 'N/A'}
          </div>
        </div>

        <div className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <XCircle size={11} className="text-graphite-400" />
            <span className="section-label text-[9px]">Action Message</span>
          </div>
          <div className="text-xs text-graphite-200 leading-relaxed">
            {result.action_message !== 'N/A' ? result.action_message : 'N/A'}
          </div>
        </div>
      </div>

      {/* Timestamp */}
      {result.action_timestamp !== 'N/A' && (
        <div className="pt-3 border-t border-graphite-700">
          <span className="text-[10px] font-mono text-graphite-400">
            Timestamp: {formatTimestamp(result.action_timestamp)}
          </span>
        </div>
      )}
    </div>
  );
}
