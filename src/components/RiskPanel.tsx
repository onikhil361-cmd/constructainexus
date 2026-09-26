import React from 'react';
import type { WorkflowResult } from '../types';
import { RiskBadge } from './RiskBadge';
import { getRiskGlowColor } from '../utils/riskColors';
import { formatDate, formatQuantity, cn } from '../utils/formatters';
import { TrendingUp, Package, Calendar, AlertTriangle } from 'lucide-react';

interface RiskPanelProps {
  result: WorkflowResult;
  isDemoMode?: boolean;
}

export function RiskPanel({ result, isDemoMode }: RiskPanelProps) {
  const req = typeof result.required_quantity === 'number' ? result.required_quantity : parseFloat(String(result.required_quantity)) || 0;
  const avail = typeof result.available_quantity === 'number' ? result.available_quantity : parseFloat(String(result.available_quantity)) || 0;
  const short = typeof result.shortage_quantity === 'number' ? result.shortage_quantity : parseFloat(String(result.shortage_quantity)) || 0;

  const fillPct = req > 0 ? Math.min((avail / req) * 100, 100) : 0;

  return (
    <div className={cn('glass-card p-6', getRiskGlowColor(result.risk_level))}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1.5">LIVE MATERIAL RISK</div>
          <div className="text-xl font-bold text-white">
            {result.material !== 'N/A' ? result.material : '—'}
          </div>
          {result.activity !== 'N/A' && (
            <div className="text-sm text-graphite-300 mt-0.5">{result.activity}</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded">DEMO</span>
          )}
          <RiskBadge level={result.risk_level} size="lg" />
        </div>
      </div>

      {/* Quantity Visual */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold tracking-wider text-graphite-300 uppercase">Inventory Coverage</span>
          <span className="text-xs font-mono text-graphite-300">{Math.round(fillPct)}%</span>
        </div>
        <div className="h-3 bg-graphite-800 rounded-full overflow-hidden border border-graphite-700">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              fillPct < 33 ? 'bg-red-500' : fillPct < 66 ? 'bg-amber-500' : 'bg-emerald-500'
            )}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Three quantity cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'REQUIRED', value: req, color: 'text-cyan-400', border: 'border-cyan-500/20', icon: Package },
          { label: 'AVAILABLE', value: avail, color: 'text-emerald-400', border: 'border-emerald-500/20', icon: TrendingUp },
          { label: 'SHORTAGE', value: short, color: short > 0 ? 'text-red-400' : 'text-emerald-400', border: short > 0 ? 'border-red-500/20' : 'border-emerald-500/20', icon: AlertTriangle },
        ].map(({ label, value, color, border, icon: Icon }) => (
          <div key={label} className={cn('bg-graphite-900/60 border rounded-xl p-3 text-center', border)}>
            <Icon size={14} className={cn('mx-auto mb-1.5', color)} />
            <div className={cn('text-2xl font-bold font-mono', color)}>{formatQuantity(value)}</div>
            <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-graphite-700">
        <div>
          <div className="section-label mb-1">Required By</div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-graphite-400" />
            <span className="text-sm font-mono text-cyan-400">{formatDate(result.required_by)}</span>
          </div>
        </div>
        <div>
          <div className="section-label mb-1">Inventory Status</div>
          <div className="text-sm text-white">{result.inventory_status}</div>
        </div>
      </div>
    </div>
  );
}
