import type { RiskLevel } from '../types';

export function getRiskColor(level: RiskLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'LOW':      return 'text-emerald-400';
    case 'MEDIUM':   return 'text-amber-400';
    case 'HIGH':     return 'text-orange-400';
    case 'CRITICAL': return 'text-red-400';
    default:         return 'text-graphite-300';
  }
}

export function getRiskBgColor(level: RiskLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'LOW':      return 'bg-emerald-500/10 border-emerald-500/30';
    case 'MEDIUM':   return 'bg-amber-500/10 border-amber-500/30';
    case 'HIGH':     return 'bg-orange-500/10 border-orange-500/30';
    case 'CRITICAL': return 'bg-red-500/10 border-red-500/30';
    default:         return 'bg-graphite-700/50 border-graphite-600';
  }
}

export function getRiskDotColor(level: RiskLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'LOW':      return 'bg-emerald-400';
    case 'MEDIUM':   return 'bg-amber-400';
    case 'HIGH':     return 'bg-orange-400';
    case 'CRITICAL': return 'bg-red-400';
    default:         return 'bg-graphite-400';
  }
}

export function getRiskGlowColor(level: RiskLevel | string): string {
  switch (level?.toUpperCase()) {
    case 'LOW':      return 'shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    case 'MEDIUM':   return 'shadow-[0_0_20px_rgba(245,158,11,0.2)]';
    case 'HIGH':     return 'shadow-[0_0_20px_rgba(249,115,22,0.2)]';
    case 'CRITICAL': return 'shadow-[0_0_20px_rgba(239,68,68,0.2)]';
    default:         return '';
  }
}
