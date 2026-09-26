import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { ApprovalCard } from '../components/ApprovalCard';
import { EmptyState } from '../components/EmptyState';
import { DEMO_DATA } from '../utils/demoData';

export function ApprovalsPage() {
  const { latestResult } = useWorkflow();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  const result = isDemoMode ? DEMO_DATA.result : latestResult;

  if (!result) {
    return (
      <div className="p-4 lg:p-6">
        <div className="section-label text-cyan-400 mb-2">APPROVALS</div>
        <EmptyState
          icon={<CheckCircle size={24} />}
          title="NO PENDING APPROVALS"
          subtitle="Approval decisions appear here after a schedule change analysis."
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
    <div className="p-4 lg:p-6 space-y-6 animate-in max-w-2xl">
      {/* Header */}
      <div>
        <div className="section-label text-cyan-400 mb-2">APPROVALS</div>
        <h1 className="text-2xl font-bold text-white">Decision Review Interface</h1>
        <p className="text-graphite-300 text-sm mt-1">
          Review and validate procurement approval decisions.
        </p>
      </div>

      <ApprovalCard
        result={result}
        isDemoMode={isDemoMode}
        showActions={result.approval_status === 'PENDING' || result.approval_status === 'UNKNOWN'}
        onApprove={() => navigate('/procurement')}
        onReject={() => navigate('/procurement')}
      />
    </div>
  );
}
