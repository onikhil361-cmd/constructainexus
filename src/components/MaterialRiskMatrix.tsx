import React from 'react';
import type { WorkflowResult } from '../types';
import { RiskBadge } from './RiskBadge';
import { formatDate, formatQuantity, cn } from '../utils/formatters';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface MaterialRiskMatrixProps {
  results: WorkflowResult[];
  onSelect?: (result: WorkflowResult) => void;
  isDemoMode?: boolean;
}

export function MaterialRiskMatrix({ results, onSelect, isDemoMode }: MaterialRiskMatrixProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon={<AlertTriangle size={24} />}
        title="NO ACTIVE MATERIAL RISKS"
        subtitle="Run a schedule change analysis to begin."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      {isDemoMode && (
        <div className="mb-3 text-[10px] font-mono text-amber-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          DEMO DATA — FOR DEMONSTRATION PURPOSES ONLY
        </div>
      )}
      <table className="w-full text-sm" role="table" aria-label="Material risk matrix">
        <thead>
          <tr className="border-b border-graphite-700">
            {['Material', 'Required', 'Available', 'Shortage', 'Required By', 'Risk', ''].map(h => (
              <th
                key={h}
                className="text-left py-3 px-3 text-[10px] font-semibold tracking-widest text-graphite-300 uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr
              key={i}
              onClick={() => onSelect?.(r)}
              className={cn(
                'border-b border-graphite-700/50 transition-colors duration-150 group',
                onSelect ? 'cursor-pointer hover:bg-graphite-700/30' : ''
              )}
              tabIndex={onSelect ? 0 : undefined}
              onKeyDown={e => e.key === 'Enter' && onSelect?.(r)}
              role={onSelect ? 'button' : undefined}
              aria-label={onSelect ? `View risk details for ${r.material}` : undefined}
            >
              <td className="py-3 px-3">
                <div className="font-medium text-white">{r.material}</div>
                <div className="text-[11px] text-graphite-400">{r.activity}</div>
              </td>
              <td className="py-3 px-3 font-mono text-cyan-400">{formatQuantity(r.required_quantity)}</td>
              <td className="py-3 px-3 font-mono text-emerald-400">{formatQuantity(r.available_quantity)}</td>
              <td className="py-3 px-3 font-mono text-red-400">{formatQuantity(r.shortage_quantity)}</td>
              <td className="py-3 px-3 font-mono text-graphite-300 text-xs">{formatDate(r.required_by)}</td>
              <td className="py-3 px-3">
                <RiskBadge level={r.risk_level} size="sm" />
              </td>
              <td className="py-3 px-3">
                {onSelect && (
                  <ChevronRight size={14} className="text-graphite-500 group-hover:text-cyan-400 transition-colors" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
