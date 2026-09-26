import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WorkflowResult, ScheduleChangeInput, AuditEntry } from '../types';
import { callProcurementWebhook, N8nError } from '../services/n8nService';
import { loadHistory, addHistoryEntry } from '../services/historyService';

interface WorkflowContextValue {
  latestResult: WorkflowResult | null;
  latestInput: ScheduleChangeInput | null;
  isLoading: boolean;
  error: string | null;
  errorType: string | null;
  auditHistory: AuditEntry[];
  submitScheduleChange: (input: ScheduleChangeInput) => Promise<void>;
  retryLastSubmit: () => void;
  clearError: () => void;
  clearResult: () => void;
  setAuditHistory: React.Dispatch<React.SetStateAction<AuditEntry[]>>;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [latestResult, setLatestResult] = useState<WorkflowResult | null>(null);
  const [latestInput, setLatestInput] = useState<ScheduleChangeInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>(() => loadHistory());

  const runWorkflow = useCallback(async (input: ScheduleChangeInput) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setLatestInput(input);

    try {
      const result = await callProcurementWebhook(input);
      setLatestResult(result);
      setAuditHistory(prev => addHistoryEntry(input, result, prev));
    } catch (err) {
      if (err instanceof N8nError) {
        setError(err.message);
        setErrorType(err.type);
      } else if (err instanceof Error) {
        setError(err.message);
        setErrorType('unknown');
      } else {
        setError('An unexpected error occurred.');
        setErrorType('unknown');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitScheduleChange = useCallback(async (input: ScheduleChangeInput) => {
    await runWorkflow(input);
  }, [runWorkflow]);

  const retryLastSubmit = useCallback(() => {
    if (latestInput) {
      runWorkflow(latestInput);
    }
  }, [latestInput, runWorkflow]);

  const clearError = useCallback(() => {
    setError(null);
    setErrorType(null);
  }, []);

  const clearResult = useCallback(() => {
    setLatestResult(null);
    setLatestInput(null);
    setError(null);
    setErrorType(null);
  }, []);

  return (
    <WorkflowContext.Provider value={{
      latestResult,
      latestInput,
      isLoading,
      error,
      errorType,
      auditHistory,
      submitScheduleChange,
      retryLastSubmit,
      clearError,
      clearResult,
      setAuditHistory,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow(): WorkflowContextValue {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
}
