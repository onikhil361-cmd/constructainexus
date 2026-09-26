import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { ProcurementCard } from '../components/ProcurementCard';
import { ApprovalCard } from '../components/ApprovalCard';
import { ProcurementActionCard } from '../components/ProcurementActionCard';
import { VerificationConsole } from '../components/VerificationConsole';
import { RecoveryPanel } from '../components/RecoveryPanel';
import { EmptyState } from '../components/EmptyState';
import { DEMO_DATA } from '../utils/demoData';

export function ProcurementPage() {
  const { latestResult } = useWorkflow();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const result = isDemoMode ? DEMO_DATA.result : latestResult;

  if (!result) {
    return (
      <div className="p-4 lg:p-6">
        <div className="section-label text-cyan-400 mb-2">PROCUREMENT INTELLIGENCE</div>
        <EmptyState
          icon={<ShoppingCart size={24} />}
          title="NO PROCUREMENT DATA"
          subtitle="Run a schedule change analysis to generate procurement decisions."
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

  const hasFailed = result.verification_status === 'FAILED';

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in">
      {/* Header */}
      <div>
        <div className="section-label text-cyan-400 mb-2">PROCUREMENT INTELLIGENCE</div>
        <h1 className="text-2xl font-bold text-white">Procurement Decision & Execution</h1>
        <p className="text-graphite-300 text-sm mt-1">
          Full workflow: Decision → Approval → Action → Verification
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <ProcurementCard result={result} isDemoMode={isDemoMode} />
          <ApprovalCard result={result} isDemoMode={isDemoMode} />
        </div>
        <div className="space-y-5">
          <ProcurementActionCard result={result} isDemoMode={isDemoMode} />
          <VerificationConsole result={result} isDemoMode={isDemoMode} />
          {hasFailed && <RecoveryPanel result={result} />}
        </div>
      </div>
    </div>
  );
}
