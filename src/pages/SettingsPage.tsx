import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Zap, Eye, Beaker, AlertTriangle, CheckCircle,
  ExternalLink, RefreshCw, Trash2,
} from 'lucide-react';
import { useDemoMode } from '../hooks/useDemoMode';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { useWorkflow } from '../hooks/useWorkflow';
import { DEMO_DATA, DEMO_FAILURE_RESULT } from '../utils/demoData';
import { clearHistory } from '../services/historyService';
import { addHistoryEntry } from '../services/historyService';
import { cn } from '../utils/formatters';

export function SettingsPage() {
  const { isDemoMode, toggleDemoMode, setDemoMode } = useDemoMode();
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();
  const { setAuditHistory, auditHistory } = useWorkflow();
  const navigate = useNavigate();

  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://nikhilnick04.app.n8n.cloud/webhook/procurement-schedule-change';

  const handleSimulateSuccess = () => {
    setDemoMode(true);
    const updated = addHistoryEntry(DEMO_DATA.input, DEMO_DATA.result, auditHistory);
    setAuditHistory(updated);
    setSimulationResult('success');
    setTimeout(() => navigate('/procurement'), 1500);
  };

  const handleSimulateFailure = () => {
    setDemoMode(true);
    const updated = addHistoryEntry(DEMO_DATA.input, DEMO_FAILURE_RESULT, auditHistory);
    setAuditHistory(updated);
    setSimulationResult('failure');
    setTimeout(() => navigate('/procurement'), 1500);
  };

  const handleClearHistory = () => {
    const cleared = clearHistory();
    setAuditHistory(cleared);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in max-w-2xl">
      {/* Header */}
      <div>
        <div className="section-label text-cyan-400 mb-2">SYSTEM</div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-graphite-300 text-sm mt-1">
          Configure demo mode, presentation settings, and system preferences.
        </p>
      </div>

      {/* Demo Mode */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Beaker size={16} className="text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Demo Mode</div>
            <div className="text-xs text-graphite-300">Display simulated data without calling the n8n backend</div>
          </div>
          <button
            onClick={toggleDemoMode}
            className={cn(
              'ml-auto w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-cyan-500',
              isDemoMode ? 'bg-amber-500' : 'bg-graphite-600'
            )}
            role="switch"
            aria-checked={isDemoMode}
            aria-label="Toggle demo mode"
          >
            <span className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
              isDemoMode ? 'translate-x-6' : 'translate-x-0'
            )} />
          </button>
        </div>
        {isDemoMode && (
          <div className="demo-banner text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            DEMO MODE ACTIVE — Using simulated data
          </div>
        )}
      </div>

      {/* Presentation Mode */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <Eye size={16} className="text-violet-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Presentation Mode</div>
            <div className="text-xs text-graphite-300">Fullscreen layout for hackathon demos</div>
          </div>
          <button
            onClick={togglePresentationMode}
            className={cn(
              'ml-auto w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-cyan-500',
              isPresentationMode ? 'bg-violet-500' : 'bg-graphite-600'
            )}
            role="switch"
            aria-checked={isPresentationMode}
            aria-label="Toggle presentation mode"
          >
            <span className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300',
              isPresentationMode ? 'translate-x-6' : 'translate-x-0'
            )} />
          </button>
        </div>
      </div>

      {/* Failure Simulation */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Demo Scenarios</div>
            <div className="text-xs text-graphite-300">Inject simulated scenarios for demonstration</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSimulateSuccess}
            className="btn-success flex-1 justify-center text-sm"
            aria-label="Simulate successful workflow"
          >
            <CheckCircle size={14} />
            SIMULATE SUCCESS
          </button>
          <button
            onClick={handleSimulateFailure}
            className="btn-danger flex-1 justify-center text-sm"
            aria-label="Simulate verification failure"
          >
            <AlertTriangle size={14} />
            SIMULATE FAILURE
          </button>
        </div>

        {simulationResult && (
          <div className={cn(
            'mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border',
            simulationResult === 'success'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-red-400 bg-red-500/10 border-red-500/20'
          )}>
            {simulationResult === 'success'
              ? <><CheckCircle size={13} /> SUCCESS SCENARIO LOADED — Redirecting…</>
              : <><AlertTriangle size={13} /> FAILURE SCENARIO LOADED — Redirecting…</>
            }
          </div>
        )}

        <p className="text-[10px] text-graphite-400 mt-3">
          FRONTEND ONLY — Simulation does not send data to n8n or place real orders.
        </p>
      </div>

      {/* Webhook Config */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
            <Zap size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">N8N Webhook Configuration</div>
            <div className="text-xs text-graphite-300">Read-only — Set via VITE_N8N_WEBHOOK_URL in .env</div>
          </div>
        </div>
        <div className="bg-graphite-950 rounded-lg p-3 border border-graphite-700 flex items-center gap-2">
          <code className="text-xs font-mono text-cyan-400 flex-1 break-all">{webhookUrl}</code>
          <a
            href={webhookUrl.replace('/webhook/', '/webhook-test/')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-graphite-400 hover:text-cyan-400 transition-colors flex-shrink-0"
            aria-label="Open n8n webhook URL"
          >
            <ExternalLink size={13} />
          </a>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400">N8N ENGINE READY</span>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-graphite-800 border border-graphite-600 flex items-center justify-center">
            <Trash2 size={16} className="text-graphite-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Data Management</div>
            <div className="text-xs text-graphite-300">LOCAL PROTOTYPE HISTORY stored in browser</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-graphite-300">
            {auditHistory.length} audit {auditHistory.length === 1 ? 'entry' : 'entries'} stored
          </span>
          <button
            onClick={handleClearHistory}
            disabled={auditHistory.length === 0}
            className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
            aria-label="Clear all audit history"
          >
            <RefreshCw size={12} />
            Clear History
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <div className="section-label mb-3">ABOUT</div>
        <div className="space-y-2 text-xs text-graphite-300">
          <div className="flex justify-between">
            <span>Product</span>
            <span className="font-mono text-white">CONSTRUCTAI</span>
          </div>
          <div className="flex justify-between">
            <span>Tagline</span>
            <span className="font-mono text-cyan-400">PREDICT. DECIDE. PROCURE. VERIFY.</span>
          </div>
          <div className="flex justify-between">
            <span>Stack</span>
            <span className="font-mono text-white">React + TypeScript + Vite + Tailwind</span>
          </div>
          <div className="flex justify-between">
            <span>Backend</span>
            <span className="font-mono text-white">n8n Cloud Webhook</span>
          </div>
          <div className="flex justify-between">
            <span>Mode</span>
            <span className={cn('font-mono', isDemoMode ? 'text-amber-400' : 'text-emerald-400')}>
              {isDemoMode ? 'DEMO MODE' : 'LIVE MODE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
