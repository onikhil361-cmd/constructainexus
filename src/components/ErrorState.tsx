import React from 'react';
import { AlertTriangle, WifiOff, Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/formatters';

interface ErrorStateProps {
  message?: string;
  type?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, type, onRetry, className }: ErrorStateProps) {
  const navigate = useNavigate();

  const Icon = type === 'network' || type === 'timeout'
    ? (type === 'timeout' ? Clock : WifiOff)
    : AlertTriangle;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
        <Icon size={28} className="text-red-400" />
      </div>

      <div className="text-xs font-semibold tracking-widest text-red-400 uppercase mb-2">
        AGENT ENGINE UNAVAILABLE
      </div>

      <h2 className="text-lg font-bold text-white mb-3">
        {type === 'timeout'
          ? 'Request Timed Out'
          : type === 'network'
          ? 'Connection Failed'
          : 'Analysis Failed'}
      </h2>

      <p className="text-sm text-graphite-300 max-w-md mb-2">
        {message || "We couldn't reach the n8n orchestration engine."}
      </p>

      <p className="text-xs text-graphite-400 max-w-sm mb-8">
        Check your internet connection and ensure the n8n workflow is active.
      </p>

      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary"
            aria-label="Retry the request"
          >
            <RefreshCw size={15} />
            RETRY
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={15} />
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
