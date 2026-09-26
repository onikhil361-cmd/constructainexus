import type { AuditEntry, WorkflowResult, ScheduleChangeInput } from '../types';
import { generateId, nowISO, truncate } from '../utils/formatters';

const STORAGE_KEY = 'constructai_audit_history';

export function loadHistory(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuditEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: AuditEntry[]): void {
  try {
    const trimmed = entries.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable in some environments
  }
}

export function addHistoryEntry(
  input: ScheduleChangeInput,
  result: WorkflowResult,
  entries: AuditEntry[]
): AuditEntry[] {
  const status = result.verification_status === 'FAILED'
    ? 'FAILURE'
    : result.verification_status === 'VERIFIED'
    ? 'SUCCESS'
    : 'PENDING';

  const entry: AuditEntry = {
    id: generateId(),
    timestamp: nowISO(),
    agent: 'N8N ORCHESTRATOR',
    input_summary: `${input.activity} | ${input.material} | ${input.qty_needed} units | ${input.location}`,
    output_summary: `Risk: ${result.risk_level} | Action: ${result.recommended_action} | Verification: ${result.verification_status}`,
    status,
    workflow_result: result,
    form_input: input,
  };

  const updated = [entry, ...entries];
  saveHistory(updated);
  return updated;
}

export function clearHistory(): AuditEntry[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return [];
}

export function addDemoEntry(
  input: ScheduleChangeInput,
  result: WorkflowResult,
  entries: AuditEntry[],
  label: string
): AuditEntry[] {
  const entry: AuditEntry = {
    id: generateId(),
    timestamp: nowISO(),
    agent: `DEMO MODE — ${label}`,
    input_summary: `[DEMO] ${truncate(input.activity)} | ${input.material}`,
    output_summary: `[DEMO] Risk: ${result.risk_level} | Verification: ${result.verification_status}`,
    status: result.verification_status === 'FAILED' ? 'FAILURE' : 'SUCCESS',
    workflow_result: result,
    form_input: input,
  };
  const updated = [entry, ...entries];
  saveHistory(updated);
  return updated;
}
