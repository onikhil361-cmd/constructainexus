import React, { useState, useMemo } from 'react';
import { ScrollText, Search, Filter, Trash2 } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { EmptyState } from '../components/EmptyState';
import { RiskBadge } from '../components/RiskBadge';
import { formatTimestamp, truncate, cn } from '../utils/formatters';
import { clearHistory } from '../services/historyService';
import type { AuditEntry } from '../types';

const STATUS_COLORS = {
  SUCCESS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  FAILURE: 'text-red-400 bg-red-500/10 border-red-500/20',
  WARNING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  PENDING: 'text-graphite-300 bg-graphite-700/50 border-graphite-600',
};

export function AuditTrailPage() {
  const { auditHistory, setAuditHistory } = useWorkflow();
  const { isDemoMode } = useDemoMode();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  const agents = useMemo(() =>
    ['ALL', ...Array.from(new Set(auditHistory.map(e => e.agent)))],
  [auditHistory]);

  const filtered = useMemo(() => {
    return auditHistory.filter(entry => {
      const matchSearch = !search || (
        entry.input_summary.toLowerCase().includes(search.toLowerCase()) ||
        entry.output_summary.toLowerCase().includes(search.toLowerCase()) ||
        entry.agent.toLowerCase().includes(search.toLowerCase())
      );
      const matchStatus = statusFilter === 'ALL' || entry.status === statusFilter;
      const matchAgent = agentFilter === 'ALL' || entry.agent === agentFilter;
      return matchSearch && matchStatus && matchAgent;
    });
  }, [auditHistory, search, statusFilter, agentFilter]);

  const handleClear = () => {
    const cleared = clearHistory();
    setAuditHistory(cleared);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="section-label text-cyan-400 mb-2">AUDIT TRAIL</div>
          <h1 className="text-2xl font-bold text-white">Enterprise Audit Log</h1>
          <p className="text-graphite-300 text-sm mt-1">
            Immutable record of all agentic workflow executions.
          </p>
        </div>
        {auditHistory.length > 0 && (
          <button
            onClick={handleClear}
            className="btn-secondary text-xs gap-1.5"
            aria-label="Clear audit history"
          >
            <Trash2 size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Prototype notice */}
      <div className="flex items-center gap-2 px-3 py-2 bg-graphite-800 border border-graphite-600 rounded-lg text-[11px] text-graphite-300">
        <span className="text-amber-400 font-semibold">LOCAL PROTOTYPE HISTORY</span>
        {' — '}Stored in browser localStorage. Not a production database.
      </div>

      {auditHistory.length === 0 ? (
        <EmptyState
          icon={<ScrollText size={24} />}
          title="NO AUDIT ENTRIES"
          subtitle="Workflow executions will appear here after running analyses."
        />
      ) : (
        <>
          {/* Filters */}
          <div className="glass-card p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400 pointer-events-none" />
                <input
                  type="text"
                  className="cai-input pl-9 text-sm"
                  placeholder="Search audit entries…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search audit entries"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400 pointer-events-none" />
                <select
                  className="cai-input pl-9 text-sm pr-8 appearance-none"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  {['ALL', 'SUCCESS', 'FAILURE', 'WARNING', 'PENDING'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Agent filter */}
              <div className="relative">
                <select
                  className="cai-input text-sm pr-8 appearance-none"
                  value={agentFilter}
                  onChange={e => setAgentFilter(e.target.value)}
                  aria-label="Filter by agent"
                >
                  {agents.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-[10px] text-graphite-400 mt-2">
              {filtered.length} of {auditHistory.length} entries
            </div>
          </div>

          {/* Audit table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Audit trail">
                <thead>
                  <tr className="border-b border-graphite-700">
                    {['Timestamp', 'Agent', 'Input Summary', 'Output Summary', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-widest text-graphite-300 uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entry => (
                    <React.Fragment key={entry.id}>
                      <tr
                        className="border-b border-graphite-700/50 hover:bg-graphite-700/20 transition-colors cursor-pointer group"
                        onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setExpanded(expanded === entry.id ? null : entry.id)}
                        aria-expanded={expanded === entry.id}
                        role="button"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-graphite-300 whitespace-nowrap">
                          {formatTimestamp(entry.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-semibold text-cyan-400 font-mono">{entry.agent}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-graphite-200">{truncate(entry.input_summary, 60)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-graphite-300">{truncate(entry.output_summary, 60)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border',
                            STATUS_COLORS[entry.status]
                          )}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-graphite-500 text-xs group-hover:text-cyan-400 transition-colors">
                          {expanded === entry.id ? '▲' : '▼'}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expanded === entry.id && entry.workflow_result && (
                        <tr className="border-b border-graphite-700/50 bg-graphite-900/30">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                              {[
                                { label: 'Material', value: entry.workflow_result.material },
                                { label: 'Risk Level', value: entry.workflow_result.risk_level },
                                { label: 'Action', value: entry.workflow_result.recommended_action },
                                { label: 'Verification', value: entry.workflow_result.verification_status },
                              ].map(({ label, value }) => (
                                <div key={label} className="bg-graphite-900 rounded-lg p-2.5 border border-graphite-700/50">
                                  <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase mb-1">{label}</div>
                                  {label === 'Risk Level' ? (
                                    <RiskBadge level={String(value)} size="sm" />
                                  ) : (
                                    <div className="text-xs font-mono text-white">{String(value)}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-graphite-400">
                No entries match the current filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
