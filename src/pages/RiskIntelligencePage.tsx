import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Plus, Cloud, Truck, Database, BarChart2 } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { RiskPanel } from '../components/RiskPanel';
import { RiskBadge } from '../components/RiskBadge';
import { EmptyState } from '../components/EmptyState';
import { DEMO_DATA } from '../utils/demoData';
import { formatDate, formatQuantity } from '../utils/formatters';

export function RiskIntelligencePage() {
  const { latestResult } = useWorkflow();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const result = isDemoMode ? DEMO_DATA.result : latestResult;

  if (!result) {
    return (
      <div className="p-4 lg:p-6">
        <div className="section-label text-cyan-400 mb-2">RISK INTELLIGENCE</div>
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="NO RISK DATA AVAILABLE"
          subtitle="Run a schedule change analysis to view risk intelligence."
          action={
            <button onClick={() => navigate('/schedule')} className="btn-primary text-sm">
              <Plus size={14} />
              NEW SCHEDULE CHANGE
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="section-label text-cyan-400 mb-2">RISK INTELLIGENCE</div>
          <h1 className="text-2xl font-bold text-white">Material Risk Analysis</h1>
          <p className="text-graphite-300 text-sm mt-1">
            {result.activity} · {formatDate(result.required_by)}
          </p>
        </div>
        <RiskBadge level={result.risk_level} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left col */}
        <div className="space-y-5">
          <RiskPanel result={result} isDemoMode={isDemoMode} />

          {/* Risk Signals */}
          <div className="glass-card p-5">
            <div className="section-label mb-4">RISK SIGNALS</div>
            <div className="space-y-3">
              {[
                {
                  icon: Database,
                  label: 'Inventory Status',
                  value: result.inventory_status,
                  color: result.inventory_status?.toLowerCase().includes('critical') ? 'text-red-400' : 'text-amber-400',
                },
                {
                  icon: Truck,
                  label: 'Supplier Assessment',
                  value: result.supplier_assessment,
                  color: 'text-cyan-300',
                },
                {
                  icon: Cloud,
                  label: 'Weather Impact',
                  value: result.weather_impact,
                  color: 'text-sky-400',
                },
                {
                  icon: BarChart2,
                  label: 'Data Quality',
                  value: result.data_quality,
                  color: 'text-emerald-400',
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex gap-3 p-3 bg-graphite-900/50 rounded-lg border border-graphite-700/50">
                  <Icon size={14} className="text-graphite-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[9px] font-semibold tracking-widest uppercase text-graphite-300 mb-1">{label}</div>
                    <div className={`text-sm font-medium ${color}`}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Why This Risk */}
          <div className="glass-card p-5">
            <div className="section-label mb-3">WHY THIS RISK?</div>
            <p className="text-sm text-graphite-200 leading-relaxed">
              {result.reason !== 'N/A' ? result.reason : 'AI reasoning not available. Run analysis for detailed explanation.'}
            </p>
          </div>

          {/* Detailed quantities */}
          <div className="glass-card p-5">
            <div className="section-label mb-4">QUANTITY BREAKDOWN</div>
            <div className="space-y-2">
              {[
                { label: 'Required Quantity', value: formatQuantity(result.required_quantity), note: 'Total needed' },
                { label: 'Available Inventory', value: formatQuantity(result.available_quantity), note: 'Currently in stock' },
                { label: 'Shortage', value: formatQuantity(result.shortage_quantity), note: 'To be procured', highlight: true },
                { label: 'Required By', value: formatDate(result.required_by), note: 'On-site deadline' },
              ].map(({ label, value, note, highlight }) => (
                <div key={label} className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
                  highlight ? 'bg-red-500/5 border-red-500/20' : 'bg-graphite-900/50 border-graphite-700/50'
                }`}>
                  <div>
                    <div className="text-xs font-medium text-white">{label}</div>
                    <div className="text-[10px] text-graphite-400">{note}</div>
                  </div>
                  <div className={`text-base font-bold font-mono ${highlight ? 'text-red-400' : 'text-cyan-400'}`}>
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended next step */}
          {result.recommended_next_step !== 'N/A' && (
            <div className="glass-card p-5 border-cyan-500/10">
              <div className="section-label text-cyan-400 mb-3">RECOMMENDED NEXT STEP</div>
              <p className="text-sm text-cyan-300">{result.recommended_next_step}</p>
              <button
                onClick={() => navigate('/procurement')}
                className="btn-primary text-xs mt-4"
              >
                VIEW PROCUREMENT DECISION →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
