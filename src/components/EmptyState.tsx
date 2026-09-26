import React from 'react';
import { cn } from '../utils/formatters';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-graphite-800 border border-graphite-600 flex items-center justify-center mb-5 text-graphite-400">
          {icon}
        </div>
      )}
      <div className="text-base font-semibold text-white mb-2">{title}</div>
      {subtitle && (
        <p className="text-sm text-graphite-300 max-w-xs">{subtitle}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
