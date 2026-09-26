import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, AlertTriangle, CheckCircle, ShoppingCart, Zap } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { KPICard } from '../components/KPICard';
import { RiskPanel } from '../components/RiskPanel';
import { MaterialRiskMatrix } from '../components/MaterialRiskMatrix';
import { DEMO_DATA } from '../utils/demoData';

export function DashboardPage() {
  const { latestResult, auditHistory } = useWorkflow();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const displayResult = isDemoMode ? DEMO_DATA.result : latestResult;

  const activeRisks = isDemoMode ? 1 : auditHistory.filter(e => e.status !== 'SUCCESS').length;
  const criticalRisks = isDemoMode ? 1 : auditHistory.filter(e =>
    e.workflow_result?.risk_level === 'CRITICAL'
  ).length;
  const pendingApprovals = isDemoMode ? 1 : auditHistory.filter(e =>
    e.workflow_result?.approval_status === 'PENDING'
  ).length;
  const procurementActions = isDemoMode ? 1 : auditHistory.filter(e =>
    e.workflow_result?.procurement_action && e.workflow_result.procurement_action !== 'N/A'
  ).length;

  const hasData = isDemoMode || !!latestResult;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in">
      {/* Hero */}
      <div className="relative overflow-hidden glass-card p-8 border-cyan-500/10">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-cyan-400" />
            <span className="section-label text-cyan-400">CONSTRUCTAI COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient-hero leading-tight mb-3">
            CONSTRUCTION PROCUREMENT<br />INTELLIGENCE
          </h1>
          <p className="text-graphite-300 max-w-lg mb-6">
            Detect material risk before it becomes a project delay.
          </p>
          <button
            onClick={() => navigate('/schedule')}
            className="btn-primary text-sm"
            aria-label="Create new schedule change analysis"
          >
            <Plus size={16} />
            NEW SCHEDULE CHANGE
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Risks"
          value={activeRisks}
          icon={TrendingUp}
          color="amber"
          isDemo={isDemoMode}
          isNA={!hasData && !isDemoMode}
        />
        <KPICard
          label="Critical Risks"
          value={criticalRisks}
          icon={AlertTriangle}
          color="red"
          isDemo={isDemoMode}
          isNA={!hasData && !isDemoMode}
        />
        <KPICard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={CheckCircle}
          color="violet"
          isDemo={isDemoMode}
          isNA={!hasData && !isDemoMode}
        />
        <KPICard
          label="Procurement Actions"
          value={procurementActions}
          icon={ShoppingCart}
          color="cyan"
          isDemo={isDemoMode}
          isNA={!hasData && !isDemoMode}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Risk Panel */}
        <div>
          {displayResult ? (
            <RiskPanel result={displayResult} isDemoMode={isDemoMode} />
          ) : (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
              <div className="w-12 h-12 rounded-xl bg-graphite-800 border border-graphite-600 flex items-center justify-center mb-4">
                <TrendingUp size={22} className="text-graphite-400" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">NO LIVE RISK DATA</div>
              <p className="text-xs text-graphite-300">
                Create a schedule change to activate risk analysis.
              </p>
              <button
                onClick={() => navigate('/schedule')}
                className="btn-primary text-xs mt-4"
              >
                <Plus size={13} />
                RUN ANALYSIS
              </button>
            </div>
          )}
        </div>

        {/* Material Risk Matrix */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label">MATERIAL RISK MATRIX</div>
            {displayResult && (
              <button
                onClick={() => navigate('/risk')}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Details →
              </button>
            )}
          </div>
          <MaterialRiskMatrix
            results={displayResult ? [displayResult] : []}
            onSelect={() => navigate('/risk')}
            isDemoMode={isDemoMode}
          />
        </div>
      </div>

      {/* Recent Activity */}
      {auditHistory.length > 0 && !isDemoMode && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label">RECENT WORKFLOW ACTIVITY</div>
            <button onClick={() => navigate('/audit')} className="text-xs text-cyan-400 hover:text-cyan-300">
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {auditHistory.slice(0, 3).map(entry => (
              <div key={entry.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-graphite-900/50 border border-graphite-700/50">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.status === 'SUCCESS' ? 'bg-emerald-400' : entry.status === 'FAILURE' ? 'bg-red-400' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{entry.input_summary}</div>
                  <div className="text-[10px] text-graphite-400 font-mono">{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
                <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                  entry.status === 'SUCCESS' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                  entry.status === 'FAILURE' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                  'text-amber-400 border-amber-500/20 bg-amber-500/10'
                }`}>
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
