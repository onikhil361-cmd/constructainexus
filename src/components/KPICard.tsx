import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/formatters';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'cyan' | 'red' | 'amber' | 'emerald' | 'violet';
  trend?: string;
  isDemo?: boolean;
  isNA?: boolean;
}

const colorMap = {
  cyan:    { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', value: 'text-cyan-400' },
  red:     { icon: 'text-red-400',  bg: 'bg-red-500/10',  border: 'border-red-500/20',  value: 'text-red-400'  },
  amber:   { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', value: 'text-amber-400' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', value: 'text-emerald-400' },
  violet:  { icon: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', value: 'text-violet-400' },
};

export function KPICard({ label, value, icon: Icon, color = 'cyan', trend, isDemo, isNA }: KPICardProps) {
  const c = colorMap[color];

  return (
    <div className="glass-card p-4 flex items-start gap-4">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border', c.bg, c.border)}>
        <Icon size={18} className={c.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="section-label mb-1.5">{label}</div>
        <div className="flex items-baseline gap-2">
          <div className={cn(
            'text-2xl font-bold font-mono',
            isNA ? 'text-graphite-400' : c.value
          )}>
            {isNA ? 'N/A' : String(value)}
          </div>
          {isDemo && !isNA && (
            <span className="text-[9px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 rounded">DEMO</span>
          )}
        </div>
        {trend && !isNA && (
          <div className="text-[10px] text-graphite-300 mt-0.5">{trend}</div>
        )}
        {isNA && (
          <div className="text-[10px] text-graphite-400 mt-0.5">Run analysis to populate</div>
        )}
      </div>
    </div>
  );
}
