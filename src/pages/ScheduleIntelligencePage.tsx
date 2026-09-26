import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, MapPin, FileText, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useWorkflow } from '../hooks/useWorkflow';
import { useDemoMode } from '../hooks/useDemoMode';
import { AgentExecutionViz } from '../components/AgentExecutionViz';
import { ErrorState } from '../components/ErrorState';
import { DEMO_DATA } from '../utils/demoData';
import { cn } from '../utils/formatters';
import type { ScheduleChangeInput } from '../types';

interface FormErrors {
  activity?: string;
  material?: string;
  qty_needed?: string;
  needed_by?: string;
  reason?: string;
  location?: string;
}

function validate(form: Partial<ScheduleChangeInput>): FormErrors {
  const errors: FormErrors = {};
  if (!form.activity?.trim()) errors.activity = 'Activity is required';
  if (!form.material?.trim()) errors.material = 'Material is required';
  if (!form.qty_needed || form.qty_needed <= 0) errors.qty_needed = 'Enter a valid quantity (> 0)';
  if (!form.needed_by) errors.needed_by = 'Required date is needed';
  if (!form.reason?.trim()) errors.reason = 'Please provide a reason for the change';
  if (!form.location?.trim()) errors.location = 'Project location is required';
  return errors;
}

const FIELD_CONFIG = [
  {
    id: 'activity',
    label: 'Construction Activity',
    placeholder: 'e.g. Foundation Pouring',
    icon: Zap,
    type: 'text',
    hint: 'Describe the specific construction activity affected by this schedule change',
  },
  {
    id: 'material',
    label: 'Material Required',
    placeholder: 'e.g. Ready-Mix Concrete',
    icon: Package,
    type: 'text',
    hint: 'Specify the exact material name',
  },
  {
    id: 'qty_needed',
    label: 'Required Quantity',
    placeholder: '120',
    icon: Package,
    type: 'number',
    hint: 'Total units needed for this activity',
  },
  {
    id: 'needed_by',
    label: 'Required Date',
    placeholder: '',
    icon: Calendar,
    type: 'date',
    hint: 'When must this material be on-site?',
  },
  {
    id: 'reason',
    label: 'Reason for Schedule Change',
    placeholder: 'e.g. Project schedule changed due to monsoon delays',
    icon: FileText,
    type: 'textarea',
    hint: 'Explain what changed and why',
  },
  {
    id: 'location',
    label: 'Project Location',
    placeholder: 'e.g. Goa',
    icon: MapPin,
    type: 'text',
    hint: 'City or region where materials are needed',
  },
];

export function ScheduleIntelligencePage() {
  const { submitScheduleChange, isLoading, error, errorType, retryLastSubmit, latestResult, clearError } = useWorkflow();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const [form, setForm] = useState<Partial<ScheduleChangeInput>>(
    isDemoMode ? { ...DEMO_DATA.input } : {}
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((id: string, value: string | number) => {
    setForm(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    if (isDemoMode) {
      setSubmitted(true);
      setTimeout(() => navigate('/risk'), 2000);
      return;
    }

    submittingRef.current = true;
    const input: ScheduleChangeInput = {
      activity: form.activity!.trim(),
      material: form.material!.trim(),
      qty_needed: Number(form.qty_needed),
      needed_by: form.needed_by!,
      reason: form.reason!.trim(),
      location: form.location!.trim(),
    };

    await submitScheduleChange(input);
    submittingRef.current = false;
    setSubmitted(true);
  }, [form, isDemoMode, submitScheduleChange, navigate]);

  // After submission + response received, navigate to risk page
  React.useEffect(() => {
    if (submitted && latestResult && !isLoading && !error) {
      const t = setTimeout(() => navigate('/risk'), 1200);
      return () => clearTimeout(t);
    }
  }, [submitted, latestResult, isLoading, error, navigate]);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="section-label text-cyan-400 mb-2">SCHEDULE INTELLIGENCE</div>
        <h1 className="text-2xl font-bold text-white mb-2">Schedule Change Analysis</h1>
        <p className="text-graphite-300 text-sm max-w-xl">
          Tell the system what changed. The agents determine what happens next.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
              <Zap size={14} className="text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-white">Schedule Change Form</span>
            {isDemoMode && (
              <span className="ml-auto text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded">
                DEMO PREFILLED
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label="Schedule change analysis form">
            <div className="space-y-4">
              {FIELD_CONFIG.map(field => {
                const err = errors[field.id as keyof FormErrors];
                const val = form[field.id as keyof ScheduleChangeInput];

                return (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-xs font-semibold text-graphite-200 mb-1.5"
                    >
                      {field.label}
                      <span className="text-red-400 ml-0.5" aria-hidden>*</span>
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        className={cn(
                          'cai-input resize-none h-20',
                          err && 'border-red-500/60 focus:ring-red-500'
                        )}
                        placeholder={field.placeholder}
                        value={String(val ?? '')}
                        onChange={e => handleChange(field.id, e.target.value)}
                        aria-describedby={err ? `${field.id}-error` : undefined}
                        aria-invalid={!!err}
                        disabled={isLoading}
                      />
                    ) : (
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <field.icon size={14} className="text-graphite-400" />
                        </div>
                        <input
                          id={field.id}
                          type={field.type}
                          className={cn(
                            'cai-input pl-9',
                            err && 'border-red-500/60 focus:ring-red-500'
                          )}
                          placeholder={field.placeholder}
                          value={String(val ?? '')}
                          onChange={e => handleChange(
                            field.id,
                            field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                          )}
                          min={field.type === 'number' ? '1' : undefined}
                          step={field.type === 'number' ? '1' : undefined}
                          aria-describedby={err ? `${field.id}-error` : `${field.id}-hint`}
                          aria-invalid={!!err}
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    {err ? (
                      <div id={`${field.id}-error`} role="alert" className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                        <AlertCircle size={11} />
                        {err}
                      </div>
                    ) : (
                      <div id={`${field.id}-hint`} className="text-[10px] text-graphite-400 mt-1">
                        {field.hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error banner */}
            {error && (
              <div className="mt-4">
                <ErrorState
                  message={error}
                  type={errorType}
                  onRetry={retryLastSubmit}
                  className="py-8"
                />
              </div>
            )}

            {/* Submit */}
            <div className="mt-6 pt-5 border-t border-graphite-700">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center text-sm py-3"
                aria-label="Run agentic analysis"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    RUNNING ANALYSIS…
                  </>
                ) : (
                  <>
                    RUN AGENTIC ANALYSIS
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {isDemoMode && (
                <p className="text-center text-[10px] text-amber-400 mt-2">
                  DEMO MODE: Will display simulated data without calling n8n
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Agent Execution Viz OR Timeline */}
        <div className="space-y-5">
          {isLoading ? (
            <AgentExecutionViz isRunning={isLoading} />
          ) : (
            <>
              {/* How it works */}
              <div className="glass-card p-5">
                <div className="section-label mb-4">AGENT WORKFLOW</div>
                <div className="space-y-2">
                  {[
                    'Schedule change submitted → n8n receives webhook',
                    'Risk Prediction Agent assesses material shortage',
                    'Procurement Decision Agent selects optimal action',
                    'Approval simulation validates the decision',
                    'Simulated procurement action recorded',
                    'Verification confirms integrity of the workflow',
                    'Complete workflow trace added to audit log',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded flex items-center justify-center bg-graphite-800 border border-graphite-600 text-graphite-300 font-mono text-[10px] flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-graphite-300 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example payload */}
              <div className="glass-card p-5">
                <div className="section-label mb-3">EXAMPLE PAYLOAD SENT TO N8N</div>
                <pre className="text-[11px] font-mono text-cyan-400 bg-graphite-950 rounded-lg p-3 overflow-x-auto border border-graphite-700">
{`{
  "activity": "Foundation Pouring",
  "material": "Ready-Mix Concrete",
  "qty_needed": 120,
  "needed_by": "2026-10-05",
  "reason": "Schedule changed",
  "location": "Goa"
}`}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
