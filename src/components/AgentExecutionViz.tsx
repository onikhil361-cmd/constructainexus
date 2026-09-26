import React, { useEffect, useState } from 'react';
import {
  Database, BarChart2, ShoppingCart, CheckCircle, Shield,
  FileText, Cloud, Package, Users, ArrowDown, Loader2,
} from 'lucide-react';
import { cn } from '../utils/formatters';

type NodeStatus = 'idle' | 'active' | 'complete' | 'pending';

interface WorkflowNode {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  type: 'input' | 'data-cluster' | 'agent' | 'decision' | 'action' | 'audit';
  duration: number; // approx ms for animation step
}

const nodes: WorkflowNode[] = [
  { id: 'ingestion', label: 'DATA INGESTION', sublabel: 'Schedule · Inventory · Suppliers · Weather', icon: Database, type: 'input', duration: 2000 },
  { id: 'risk', label: 'RISK PREDICTION AGENT', sublabel: 'Analyzing material shortage risk', icon: BarChart2, type: 'agent', duration: 3000 },
  { id: 'procurement', label: 'PROCUREMENT DECISION AGENT', sublabel: 'Generating optimal procurement plan', icon: ShoppingCart, type: 'agent', duration: 3000 },
  { id: 'approval', label: 'APPROVAL', sublabel: 'Human review & authorization', icon: CheckCircle, type: 'decision', duration: 2000 },
  { id: 'action', label: 'PROCUREMENT ACTION', sublabel: 'Executing procurement strategy', icon: Package, type: 'action', duration: 2000 },
  { id: 'verification', label: 'VERIFICATION', sublabel: 'Validating procurement integrity', icon: Shield, type: 'decision', duration: 2000 },
  { id: 'audit', label: 'AUDIT LOG', sublabel: 'Recording complete workflow trace', icon: FileText, type: 'audit', duration: 1000 },
];

const DATA_SOURCES = [
  { icon: Database, label: 'Schedule' },
  { icon: Package, label: 'Inventory' },
  { icon: Users, label: 'Suppliers' },
  { icon: Cloud, label: 'Weather' },
];

interface AgentExecutionVizProps {
  isRunning: boolean;
  onComplete?: () => void;
}

export function AgentExecutionViz({ isRunning, onComplete }: AgentExecutionVizProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [statuses, setStatuses] = useState<Record<string, NodeStatus>>({});

  useEffect(() => {
    if (!isRunning) {
      setActiveIndex(-1);
      setStatuses({});
      return;
    }

    let idx = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const advance = () => {
      if (idx >= nodes.length) {
        onComplete?.();
        return;
      }
      const node = nodes[idx];
      setActiveIndex(idx);
      setStatuses(prev => ({ ...prev, [node.id]: 'active' }));

      timeout = setTimeout(() => {
        setStatuses(prev => ({ ...prev, [node.id]: 'complete' }));
        idx++;
        advance();
      }, node.duration);
    };

    advance();

    return () => clearTimeout(timeout);
  }, [isRunning, onComplete]);

  const steps = ['ANALYZING SCHEDULE', 'CHECKING INVENTORY', 'EVALUATING SUPPLIERS',
    'PROCESSING WEATHER', 'RUNNING RISK ANALYSIS', 'GENERATING PROCUREMENT DECISION'];
  const [stepLabel, setStepLabel] = useState(steps[0]);

  useEffect(() => {
    if (!isRunning) return;
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % steps.length;
      setStepLabel(steps[i]);
    }, 2200);
    return () => clearInterval(iv);
  }, [isRunning]);

  return (
    <div className="glass-card p-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <Loader2 size={16} className="text-cyan-400 animate-spin" />
        </div>
        <div>
          <div className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">AGENT EXECUTION</div>
          <div className="text-[11px] font-mono text-graphite-300 mt-0.5">{stepLabel}…</div>
        </div>
      </div>

      {/* Data sources row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {DATA_SOURCES.map((src) => (
          <div
            key={src.label}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all duration-500',
              statuses['ingestion'] === 'active'
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : statuses['ingestion'] === 'complete'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-graphite-800 border-graphite-600 text-graphite-400'
            )}
          >
            <src.icon size={11} />
            {src.label}
          </div>
        ))}
      </div>

      {/* Agent nodes */}
      <div className="space-y-1">
        {nodes.map((node, i) => {
          const status = statuses[node.id] ?? 'idle';
          const isActive = status === 'active';
          const isDone = status === 'complete';

          return (
            <div key={node.id}>
              {/* Connector */}
              {i > 0 && (
                <div className="flex justify-start pl-4 py-0.5">
                  <div className={cn(
                    'w-0.5 h-4 rounded-full transition-all duration-500',
                    isDone || statuses[nodes[i - 1].id] === 'complete'
                      ? 'bg-cyan-500/50'
                      : 'bg-graphite-700'
                  )} />
                </div>
              )}

              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-300',
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : isDone
                  ? 'bg-emerald-500/5 border-emerald-500/15'
                  : 'bg-graphite-900/50 border-graphite-700/50'
              )}>
                <div className={cn(
                  'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-300',
                  isActive ? 'bg-cyan-500/20' : isDone ? 'bg-emerald-500/15' : 'bg-graphite-800'
                )}>
                  {isActive
                    ? <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    : <node.icon size={14} className={isDone ? 'text-emerald-400' : 'text-graphite-400'} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'text-xs font-semibold tracking-wider transition-colors duration-300',
                    isActive ? 'text-cyan-300' : isDone ? 'text-emerald-400' : 'text-graphite-400'
                  )}>
                    {node.label}
                  </div>
                  <div className="text-[10px] text-graphite-400 truncate">{node.sublabel}</div>
                </div>
                <div className="flex-shrink-0">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />}
                  {isDone && <span className="text-[10px] font-mono text-emerald-400">✓</span>}
                  {!isActive && !isDone && <span className="w-1.5 h-1.5 rounded-full bg-graphite-600 inline-block" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-graphite-700">
        <p className="text-[10px] text-graphite-400 text-center">
          VISUALIZATION · Agent progress is animated. Results are determined by the n8n backend.
        </p>
      </div>
    </div>
  );
}
