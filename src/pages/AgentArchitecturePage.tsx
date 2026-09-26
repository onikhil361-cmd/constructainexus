import React, { useState } from 'react';
import { Network, X, ChevronRight } from 'lucide-react';
import { cn } from '../utils/formatters';

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  type: 'user' | 'orchestrator' | 'data' | 'agent' | 'decision' | 'action' | 'audit' | 'recovery';
  purpose: string;
  inputs: string;
  outputs: string;
  responsibility: string;
}

const NODES: NodeDef[] = [
  {
    id: 'user',
    label: 'USER',
    sublabel: 'Procurement Team',
    type: 'user',
    purpose: 'Initiates a schedule change analysis by submitting a form with activity, material, quantity, date, reason, and location.',
    inputs: 'Construction schedule change details entered through the ConstructAI interface',
    outputs: 'JSON payload sent to the n8n webhook endpoint',
    responsibility: 'Provide accurate schedule change data and approve/reject procurement decisions',
  },
  {
    id: 'n8n',
    label: 'N8N ORCHESTRATOR',
    sublabel: 'Workflow Engine',
    type: 'orchestrator',
    purpose: 'Central orchestration engine that receives webhook triggers and coordinates all agentic workflows. Routes data between agents and manages the full procurement lifecycle.',
    inputs: 'Schedule change webhook payload: { activity, material, qty_needed, needed_by, reason, location }',
    outputs: 'Orchestrated workflow results passed to downstream agents and returned to frontend',
    responsibility: 'Reliable, stateful orchestration of the complete procurement workflow',
  },
  {
    id: 'data',
    label: 'DATA INGESTION',
    sublabel: 'Schedule · Inventory · Suppliers · Weather',
    type: 'data',
    purpose: 'Aggregates data from four sources: project schedule, inventory management system, supplier database, and weather API. Provides a unified data context for risk analysis.',
    inputs: 'Schedule data, inventory records, supplier catalogs, weather forecasts for the project location',
    outputs: 'Unified material context: available quantity, supplier options, weather risk factors',
    responsibility: 'Ensuring data accuracy and freshness for downstream agent decisions',
  },
  {
    id: 'risk',
    label: 'RISK PREDICTION AGENT',
    sublabel: 'AI Risk Assessment',
    type: 'agent',
    purpose: 'Analyzes material shortages and assigns risk levels (LOW/MEDIUM/HIGH/CRITICAL) based on inventory gaps, supplier availability, weather conditions, and project timeline.',
    inputs: 'Unified data context from Data Ingestion: quantities, supplier status, weather data',
    outputs: 'risk_level, inventory_status, supplier_assessment, weather_impact, reason, recommended_next_step',
    responsibility: 'Accurate, explainable risk classification with supporting evidence',
  },
  {
    id: 'procurement',
    label: 'PROCUREMENT DECISION AGENT',
    sublabel: 'AI Decision Engine',
    type: 'agent',
    purpose: 'Generates the optimal procurement strategy based on risk level and available options. Selects from WAIT, MONITOR, RESERVE_INVENTORY, REQUEST_QUOTE, ORDER_NOW, EXPEDITE, SWITCH_SUPPLIER, VALIDATE_MATERIAL, or ESCALATE.',
    inputs: 'Risk assessment output, supplier options, quantity requirements, budget constraints',
    outputs: 'recommended_action, selected_supplier, quantity_to_procure, human_approval_required, expected_result',
    responsibility: 'Cost-optimal procurement decisions that minimize project delay risk',
  },
  {
    id: 'approval',
    label: 'HUMAN APPROVAL',
    sublabel: 'Prototype Simulation',
    type: 'decision',
    purpose: 'Validates the procurement decision through a simulated human approval step. In production this would route to a procurement manager for review and sign-off.',
    inputs: 'Procurement decision from the Procurement Decision Agent',
    outputs: 'approval_status, approval_decision, approved_by, approval_time',
    responsibility: 'Ensuring human oversight of significant procurement commitments (prototype: simulated)',
  },
  {
    id: 'action',
    label: 'SIMULATED PROCUREMENT',
    sublabel: 'Prototype Action',
    type: 'action',
    purpose: 'Executes the approved procurement action in simulation mode. In production this would trigger real purchase orders, supplier notifications, and ERP system updates.',
    inputs: 'Approved procurement decision',
    outputs: 'procurement_action, procurement_quantity, procurement_status, supplier_status, action_timestamp',
    responsibility: 'Reliable procurement execution with full audit trail (prototype: SIMULATED)',
  },
  {
    id: 'verification',
    label: 'VERIFICATION',
    sublabel: 'Integrity Check',
    type: 'decision',
    purpose: 'Validates the complete workflow: checks that the approval is valid, the quantity matches the requirement, and the procurement action was successfully executed.',
    inputs: 'Approval record, procurement action record, quantity requirements',
    outputs: 'verification_status (VERIFIED/FAILED), verification_message, verified_at',
    responsibility: 'End-to-end workflow integrity and data consistency validation',
  },
  {
    id: 'success',
    label: 'SUCCESS → AUDIT',
    sublabel: 'Workflow Complete',
    type: 'audit',
    purpose: 'Successful verification path. The complete workflow trace is recorded in the audit log and the result is returned to the frontend for display.',
    inputs: 'Verified workflow result',
    outputs: 'Complete audit entry in localStorage; workflow result displayed to user',
    responsibility: 'Traceability, compliance, and operational visibility',
  },
  {
    id: 'recovery',
    label: 'RECOVERY PROTOCOL',
    sublabel: 'Failure Handling',
    type: 'recovery',
    purpose: 'Activated when verification fails. Automatically rechecks supplier capacity, reassesses the procurement strategy, and escalates to a human manager for manual intervention.',
    inputs: 'Failed verification result with error details',
    outputs: 'recovery_status, recovery_action (RECHECK_SUPPLIER_AND_REASSESS_PROCUREMENT), recovery_message, recovery_timestamp',
    responsibility: 'Graceful failure handling and escalation to prevent project disruption',
  },
];

const TYPE_COLORS = {
  user:         { bg: 'bg-violet-500/10 border-violet-500/30',   label: 'text-violet-400', dot: 'bg-violet-400' },
  orchestrator: { bg: 'bg-cyan-500/10 border-cyan-500/30',      label: 'text-cyan-400',    dot: 'bg-cyan-400'   },
  data:         { bg: 'bg-sky-500/10 border-sky-500/30',         label: 'text-sky-400',     dot: 'bg-sky-400'    },
  agent:        { bg: 'bg-blue-500/10 border-blue-500/30',       label: 'text-blue-400',    dot: 'bg-blue-400'   },
  decision:     { bg: 'bg-amber-500/10 border-amber-500/30',     label: 'text-amber-400',   dot: 'bg-amber-400'  },
  action:       { bg: 'bg-orange-500/10 border-orange-500/30',   label: 'text-orange-400',  dot: 'bg-orange-400' },
  audit:        { bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'text-emerald-400', dot: 'bg-emerald-400' },
  recovery:     { bg: 'bg-red-500/10 border-red-500/30',         label: 'text-red-400',     dot: 'bg-red-400'    },
};

export function AgentArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<NodeDef | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-in">
      {/* Header */}
      <div>
        <div className="section-label text-cyan-400 mb-2">AGENT ARCHITECTURE</div>
        <h1 className="text-2xl font-bold text-white">System Architecture</h1>
        <p className="text-graphite-300 text-sm mt-1">
          Click any node to explore its purpose, inputs, outputs, and responsibilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flow diagram */}
        <div className="glass-card p-5">
          <div className="section-label mb-5">AGENT WORKFLOW DIAGRAM</div>
          <div className="space-y-1.5 overflow-x-auto">
            {NODES.map((node, i) => {
              const colors = TYPE_COLORS[node.type];
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id}>
                  <button
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cyan-500',
                      colors.bg,
                      isSelected ? 'ring-1 ring-cyan-500/50 shadow-cyan-glow' : 'hover:opacity-90'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`View details for ${node.label}`}
                  >
                    <span className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-xs font-bold tracking-wider', colors.label)}>{node.label}</div>
                      <div className="text-[10px] text-graphite-400">{node.sublabel}</div>
                    </div>
                    <ChevronRight size={13} className="text-graphite-500 flex-shrink-0" />
                  </button>

                  {i < NODES.length - 1 && (
                    <div className="flex items-center pl-4 py-0.5">
                      <div className="w-0.5 h-3 bg-graphite-700 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Node detail panel */}
        <div>
          {selectedNode ? (
            <div className="glass-card p-5 animate-in sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className={cn('text-xs font-bold tracking-widest uppercase', TYPE_COLORS[selectedNode.type].label)}>
                    {selectedNode.type.toUpperCase()}
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">{selectedNode.label}</div>
                  <div className="text-xs text-graphite-300">{selectedNode.sublabel}</div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1.5 rounded-lg hover:bg-graphite-700 transition-colors text-graphite-400 hover:text-white"
                  aria-label="Close node details"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'PURPOSE', value: selectedNode.purpose },
                  { label: 'INPUTS', value: selectedNode.inputs },
                  { label: 'OUTPUTS', value: selectedNode.outputs },
                  { label: 'RESPONSIBILITY', value: selectedNode.responsibility },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-graphite-900/60 rounded-lg p-3 border border-graphite-700/50">
                    <div className="section-label mb-2">{label}</div>
                    <p className="text-sm text-graphite-200 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Network size={32} className="text-graphite-500 mb-3" />
              <div className="text-sm font-semibold text-white mb-1">Select a Node</div>
              <p className="text-xs text-graphite-400 max-w-xs">
                Click any node in the diagram to explore its purpose, inputs, outputs, and responsibility.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <div className="section-label mb-3">NODE TYPE LEGEND</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_COLORS).map(([type, colors]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', colors.dot)} />
              <span className="text-[10px] text-graphite-300 uppercase font-semibold">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
