import React from 'react';
import type { RiskLevel } from '../types';
import { getRiskColor, getRiskBgColor, getRiskDotColor } from '../utils/riskColors';
import { cn } from '../utils/formatters';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export function RiskBadge({ level, size = 'md', showDot = true, className }: RiskBadgeProps) {
  const textColor = getRiskColor(level);
  const bgBorder = getRiskBgColor(level);
  const dotColor = getRiskDotColor(level);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'risk-badge border',
        textColor,
        bgBorder,
        sizeClasses[size],
        className
      )}
      aria-label={`Risk level: ${level}`}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor)} />
      )}
      {String(level).toUpperCase()}
    </span>
  );
}
