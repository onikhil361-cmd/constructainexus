import type { WorkflowResult, RiskLevel, ProcurementAction, VerificationStatus, ApprovalStatus, RecoveryStatus } from '../types';

// ─── Strip markdown JSON fences ────────────────────────────────────────

function stripMarkdownFences(text: string): string {
  // Remove ```json ... ``` or ``` ... ```
  return text
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();
}

// ─── Safely coerce a value to string ──────────────────────────────────

function safeStr(val: unknown, fallback = 'N/A'): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val.trim() || fallback;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') return fallback;
  return String(val);
}

function safeNum(val: unknown, fallback: string | number = 'N/A'): string | number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) return parsed;
  }
  return fallback;
}

function safeBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    return val.toLowerCase() === 'true' || val.toLowerCase() === 'yes';
  }
  return false;
}

function riskLevel(val: unknown): RiskLevel {
  const str = safeStr(val, '').toUpperCase();
  if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(str)) return str as RiskLevel;
  return 'UNKNOWN';
}

function procAction(val: unknown): ProcurementAction {
  const str = safeStr(val, '').toUpperCase();
  const valid: ProcurementAction[] = [
    'WAIT', 'MONITOR', 'RESERVE_INVENTORY', 'REQUEST_QUOTE',
    'ORDER_NOW', 'EXPEDITE', 'SWITCH_SUPPLIER', 'VALIDATE_MATERIAL', 'ESCALATE',
  ];
  if (valid.includes(str as ProcurementAction)) return str as ProcurementAction;
  return 'UNKNOWN';
}

function verStatus(val: unknown): VerificationStatus {
  const str = safeStr(val, '').toUpperCase();
  if (['VERIFIED', 'FAILED', 'PENDING'].includes(str)) return str as VerificationStatus;
  return 'UNKNOWN';
}

function approvalStatus(val: unknown): ApprovalStatus {
  const str = safeStr(val, '').toUpperCase();
  if (['APPROVED', 'REJECTED', 'PENDING'].includes(str)) return str as ApprovalStatus;
  // handle partial matches
  if (str.includes('APPROVED')) return 'APPROVED';
  if (str.includes('REJECTED')) return 'REJECTED';
  return 'UNKNOWN';
}

function recoveryStatus(val: unknown): RecoveryStatus | null {
  if (val === null || val === undefined) return null;
  const str = safeStr(val, '').toUpperCase();
  if (['ESCALATED', 'IN_PROGRESS', 'RESOLVED'].includes(str)) return str as RecoveryStatus;
  if (str.includes('ESCALAT')) return 'ESCALATED';
  return null;
}

// ─── Parse a candidate object into WorkflowResult ─────────────────────

function extractFromObject(obj: Record<string, unknown>): WorkflowResult {
  return {
    activity: safeStr(obj.activity),
    material: safeStr(obj.material),
    required_quantity: safeNum(obj.required_quantity ?? obj.qty_needed),
    available_quantity: safeNum(obj.available_quantity),
    shortage_quantity: safeNum(obj.shortage_quantity),
    required_by: safeStr(obj.required_by ?? obj.needed_by),

    inventory_status: safeStr(obj.inventory_status),
    supplier_assessment: safeStr(obj.supplier_assessment),
    weather_impact: safeStr(obj.weather_impact),
    data_quality: safeStr(obj.data_quality),
    risk_level: riskLevel(obj.risk_level),
    reason: safeStr(obj.reason),
    recommended_next_step: safeStr(obj.recommended_next_step),

    recommended_action: procAction(obj.recommended_action),
    selected_supplier: safeStr(obj.selected_supplier),
    quantity_to_procure: safeNum(obj.quantity_to_procure),
    human_approval_required: safeBool(obj.human_approval_required),
    expected_result: safeStr(obj.expected_result),

    approval_status: approvalStatus(obj.approval_status),
    approval_decision: safeStr(obj.approval_decision),
    approved_by: safeStr(obj.approved_by),
    approval_time: safeStr(obj.approval_time),
    action_status: safeStr(obj.action_status),
    action_message: safeStr(obj.action_message),

    procurement_action: safeStr(obj.procurement_action),
    procurement_quantity: safeNum(obj.procurement_quantity),
    procurement_status: safeStr(obj.procurement_status),
    supplier_status: safeStr(obj.supplier_status),
    action_timestamp: safeStr(obj.action_timestamp),

    verification_status: verStatus(obj.verification_status),
    verification_message: safeStr(obj.verification_message),
    verified_at: safeStr(obj.verified_at),

    recovery_status: recoveryStatus(obj.recovery_status),
    recovery_action: safeStr(obj.recovery_action),
    recovery_message: safeStr(obj.recovery_message),
    recovery_timestamp: safeStr(obj.recovery_timestamp),

    _raw: obj,
  };
}

// ─── Main normalizer ──────────────────────────────────────────────────

export function normalizeN8nResponse(raw: unknown): WorkflowResult {
  try {
    // 1. If it's a string, try to parse it
    if (typeof raw === 'string') {
      const cleaned = stripMarkdownFences(raw);
      try {
        raw = JSON.parse(cleaned);
      } catch {
        // Not JSON — return mostly N/A
        return extractFromObject({ reason: cleaned });
      }
    }

    // 2. If it's an array, use the first element
    if (Array.isArray(raw)) {
      if (raw.length === 0) return extractFromObject({});
      raw = raw[0];
    }

    // 3. Now it should be an object
    if (typeof raw !== 'object' || raw === null) {
      return extractFromObject({});
    }

    const obj = raw as Record<string, unknown>;

    // 4. Check for common wrapper keys: output, result, data, response
    const wrappers = ['output', 'result', 'data', 'response', 'payload', 'body'];
    for (const key of wrappers) {
      if (key in obj) {
        let inner = obj[key];

        // 4a. If inner is a string, try to parse it
        if (typeof inner === 'string') {
          const cleaned = stripMarkdownFences(inner);
          try {
            inner = JSON.parse(cleaned);
          } catch {
            // keep as string — extract what we can
            return extractFromObject({ ...obj, reason: inner as string });
          }
        }

        // 4b. If inner is an array, use first element
        if (Array.isArray(inner)) {
          inner = (inner as unknown[])[0] ?? {};
        }

        if (typeof inner === 'object' && inner !== null) {
          const innerObj = inner as Record<string, unknown>;
          // Check if this inner object has expected fields
          if (
            'risk_level' in innerObj ||
            'material' in innerObj ||
            'verification_status' in innerObj ||
            'recommended_action' in innerObj
          ) {
            return extractFromObject({ ...obj, ...innerObj });
          }
        }
      }
    }

    // 5. Try to extract directly from the object
    return extractFromObject(obj);
  } catch {
    return extractFromObject({});
  }
}
