// ─── Core Workflow Types ───────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export type ProcurementAction =
  | 'WAIT'
  | 'MONITOR'
  | 'RESERVE_INVENTORY'
  | 'REQUEST_QUOTE'
  | 'ORDER_NOW'
  | 'EXPEDITE'
  | 'SWITCH_SUPPLIER'
  | 'VALIDATE_MATERIAL'
  | 'ESCALATE'
  | 'UNKNOWN';

export type VerificationStatus = 'VERIFIED' | 'FAILED' | 'PENDING' | 'UNKNOWN';
export type ApprovalStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'UNKNOWN';
export type RecoveryStatus = 'ESCALATED' | 'IN_PROGRESS' | 'RESOLVED' | 'UNKNOWN';

// ─── Form Input ───────────────────────────────────────────────────────

export interface ScheduleChangeInput {
  activity: string;
  material: string;
  qty_needed: number;
  needed_by: string;
  reason: string;
  location: string;
}

// ─── Normalized Workflow Result ───────────────────────────────────────

export interface WorkflowResult {
  // Schedule / Material
  activity: string;
  material: string;
  required_quantity: string | number;
  available_quantity: string | number;
  shortage_quantity: string | number;
  required_by: string;

  // Risk Assessment
  inventory_status: string;
  supplier_assessment: string;
  weather_impact: string;
  data_quality: string;
  risk_level: RiskLevel;
  reason: string;
  recommended_next_step: string;

  // Procurement Decision
  recommended_action: ProcurementAction;
  selected_supplier: string;
  quantity_to_procure: string | number;
  human_approval_required: boolean | string;
  expected_result: string;

  // Approval
  approval_status: ApprovalStatus;
  approval_decision: string;
  approved_by: string;
  approval_time: string;
  action_status: string;
  action_message: string;

  // Procurement Action
  procurement_action: string;
  procurement_quantity: string | number;
  procurement_status: string;
  supplier_status: string;
  action_timestamp: string;

  // Verification
  verification_status: VerificationStatus;
  verification_message: string;
  verified_at: string;

  // Recovery (when verification fails)
  recovery_status: RecoveryStatus | null;
  recovery_action: string;
  recovery_message: string;
  recovery_timestamp: string;

  // Raw data for debugging
  _raw?: unknown;
}

// ─── Audit Entry ──────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  input_summary: string;
  output_summary: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING' | 'PENDING';
  workflow_result?: WorkflowResult;
  form_input?: ScheduleChangeInput;
}

// ─── Agent Architecture Node ─────────────────────────────────────────

export interface AgentNode {
  id: string;
  label: string;
  type: 'input' | 'orchestrator' | 'data' | 'agent' | 'decision' | 'action' | 'output';
  purpose: string;
  inputs: string;
  outputs: string;
  responsibility: string;
  x?: number;
  y?: number;
}

// ─── App State ────────────────────────────────────────────────────────

export interface AppState {
  latestResult: WorkflowResult | null;
  latestInput: ScheduleChangeInput | null;
  isLoading: boolean;
  error: string | null;
  auditHistory: AuditEntry[];
}

// ─── Demo Mode Types ─────────────────────────────────────────────────

export interface DemoData {
  input: ScheduleChangeInput;
  result: WorkflowResult;
}
