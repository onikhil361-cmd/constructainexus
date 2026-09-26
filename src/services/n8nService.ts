import type { ScheduleChangeInput, WorkflowResult } from '../types';
import { normalizeN8nResponse } from '../utils/normalizeN8nResponse';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL ||
  'https://nikhilnick04.app.n8n.cloud/webhook/procurement-schedule-change';

const TIMEOUT_MS = 60_000; // 60 seconds

export type N8nErrorType = 'network' | 'timeout' | 'http' | 'parse' | 'empty';

export class N8nError extends Error {
  public readonly type: N8nErrorType;
  public readonly statusCode?: number;

  constructor(message: string, type: N8nErrorType, statusCode?: number) {
    super(message);
    this.name = 'N8nError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

export async function callProcurementWebhook(
  input: ScheduleChangeInput
): Promise<WorkflowResult> {
  const body = {
    activity: input.activity,
    material: input.material,
    qty_needed: input.qty_needed,
    needed_by: input.needed_by,
    reason: input.reason,
    location: input.location,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new N8nError(
          'The request timed out after 60 seconds. The n8n workflow may still be running.',
          'timeout'
        );
      }
      throw new N8nError(
        'Network error: Could not reach the n8n orchestration engine. Check your internet connection.',
        'network'
      );
    }

    if (!response.ok) {
      throw new N8nError(
        `HTTP ${response.status}: The n8n engine returned an error response.`,
        'http',
        response.status
      );
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
      throw new N8nError(
        'The n8n engine returned an empty response.',
        'empty'
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    return normalizeN8nResponse(parsed);
  } finally {
    clearTimeout(timeoutId);
  }
}
