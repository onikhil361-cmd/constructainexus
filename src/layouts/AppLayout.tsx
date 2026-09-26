import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Plus, Presentation } from 'lucide-react';
import { Sidebar, MobileNav } from './Sidebar';
import { useDemoMode } from '../hooks/useDemoMode';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { cn } from '../utils/formatters';

export function AppLayout() {
  const { isDemoMode } = useDemoMode();
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();
  const navigate = useNavigate();

  if (isPresentationMode) {
    return (
      <div className="fixed inset-0 bg-graphite-950 blueprint-bg flex flex-col">
        {/* Presentation header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-graphite-700 bg-graphite-900/80">
          <div>
            <div className="text-lg font-bold tracking-widest text-white">CONSTRUCTAI</div>
            <div className="text-xs tracking-widest text-cyan-400 font-mono">PREDICT. DECIDE. PROCURE. VERIFY.</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-widest text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full">
              PRESENTATION MODE
            </span>
            <button
              onClick={togglePresentationMode}
              className="text-xs text-graphite-300 hover:text-white transition-colors border border-graphite-600 px-3 py-1 rounded-lg"
            >
              EXIT
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-graphite-950 blueprint-bg overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-graphite-900/60 border-b border-graphite-700 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="text-xs font-mono text-graphite-300">
              {new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              {' '}·{' '}
              <span className="text-cyan-400">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDemoMode && (
              <span className="text-[10px] font-semibold tracking-wider text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded-full hidden sm:block">
                DEMO
              </span>
            )}
            <button
              onClick={togglePresentationMode}
              className="hidden sm:flex items-center gap-1.5 text-xs text-graphite-300 hover:text-white transition-colors border border-graphite-600 hover:border-graphite-500 px-3 py-1.5 rounded-lg"
              aria-label="Enter presentation mode"
            >
              <Presentation size={13} />
              <span className="hidden md:block">PRESENT</span>
            </button>
            <button
              onClick={() => navigate('/schedule')}
              className="btn-primary text-xs py-2 px-3"
              aria-label="Create new schedule change"
            >
              <Plus size={14} />
              <span className="hidden sm:block">NEW CHANGE</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
