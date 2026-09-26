import type { WorkflowResult } from '../types';
import type { DemoData } from '../types';

export const DEMO_DATA: DemoData = {
  input: {
    activity: 'Foundation Pouring',
    material: 'Ready-Mix Concrete',
    qty_needed: 120,
    needed_by: '2026-10-05',
    reason: 'Project schedule changed due to monsoon delays',
    location: 'Goa',
  },
  result: {
    activity: 'Foundation Pouring',
    material: 'Ready-Mix Concrete',
    required_quantity: 120,
    available_quantity: 40,
    shortage_quantity: 80,
    required_by: '2026-10-05',

    inventory_status: 'CRITICAL_SHORTAGE',
    supplier_assessment: 'Primary supplier has limited capacity. Alternative suppliers identified.',
    weather_impact: 'Monsoon conditions may delay delivery by 2–3 days.',
    data_quality: 'HIGH',
    risk_level: 'CRITICAL',
    reason: 'Available inventory (40 units) is severely below required quantity (120 units) with a critical shortage of 80 units. Weather conditions and supplier capacity constraints elevate this to CRITICAL risk level.',
    recommended_next_step: 'Immediate procurement action required. Escalate to procurement manager.',

    recommended_action: 'ESCALATE',
    selected_supplier: 'Ultratech Cement Ltd.',
    quantity_to_procure: 80,
    human_approval_required: true,
    expected_result: 'Emergency procurement of 80 units within 48 hours to prevent project delay.',

    approval_status: 'APPROVED',
    approval_decision: 'APPROVED — SIMULATED',
    approved_by: 'System (Prototype Simulation)',
    approval_time: new Date().toISOString(),
    action_status: 'EXECUTED',
    action_message: 'Procurement order initiated pending supplier confirmation.',

    procurement_action: 'SIMULATED_ORDER_CREATED',
    procurement_quantity: 80,
    procurement_status: 'SIMULATED',
    supplier_status: 'PENDING_VALIDATION',
    action_timestamp: new Date().toISOString(),

    verification_status: 'VERIFIED',
    verification_message: 'Approval valid. Quantity valid. Procurement action valid.',
    verified_at: new Date().toISOString(),

    recovery_status: null,
    recovery_action: 'N/A',
    recovery_message: 'N/A',
    recovery_timestamp: 'N/A',

    _raw: { demo: true },
  },
};

export const DEMO_FAILURE_RESULT: WorkflowResult = {
  ...DEMO_DATA.result,
  verification_status: 'FAILED',
  verification_message: 'Quantity validation failed: procurement quantity does not match approved amount.',
  verified_at: new Date().toISOString(),

  recovery_status: 'ESCALATED',
  recovery_action: 'RECHECK_SUPPLIER_AND_REASSESS_PROCUREMENT',
  recovery_message: 'Verification failed. Escalating to procurement manager for manual review. Rechecking supplier capacity and reassessing procurement strategy.',
  recovery_timestamp: new Date().toISOString().slice(0, 19) + 'Z',
};
