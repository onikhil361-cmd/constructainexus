import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, TrendingUp, ShoppingCart,
  CheckCircle, ScrollText, Network, Settings, Menu, X,
  Zap, ChevronRight,
} from 'lucide-react';
import { useDemoMode } from '../hooks/useDemoMode';
import { usePresentationMode } from '../hooks/usePresentationMode';
import { cn } from '../utils/formatters';

const navSections = [
  {
    label: 'COMMAND CENTER',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { to: '/schedule', icon: Calendar, label: 'Schedule Intelligence' },
      { to: '/risk', icon: TrendingUp, label: 'Risk Intelligence' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { to: '/procurement', icon: ShoppingCart, label: 'Procurement' },
      { to: '/approvals', icon: CheckCircle, label: 'Approvals' },
      { to: '/audit', icon: ScrollText, label: 'Audit Trail' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { to: '/architecture', icon: Network, label: 'Agent Architecture' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-graphite-900 border-r border-graphite-700 w-64">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-graphite-700">
        <button
          onClick={() => { navigate('/'); onClose?.(); }}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="ConstructAI Home"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Zap size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest text-white">CONSTRUCTAI</div>
            <div className="text-[9px] tracking-widest text-graphite-300 uppercase">Agentic Procurement OS</div>
          </div>
        </button>
        {onClose && (
          <button onClick={onClose} className="text-graphite-300 hover:text-white transition-colors lg:hidden" aria-label="Close menu">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Demo Mode Badge */}
      {isDemoMode && (
        <div className="mx-4 mt-3">
          <div className="demo-banner text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            DEMO MODE ACTIVE
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="section-label px-2 mb-2">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5 group focus:outline-none focus:ring-1 focus:ring-cyan-500',
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                      : 'text-graphite-300 hover:text-white hover:bg-graphite-700/50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={16} className={isActive ? 'text-cyan-400' : 'text-graphite-400 group-hover:text-graphite-200'} />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight size={12} className="ml-auto text-cyan-500/60" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* N8N Status */}
      <div className="p-4 border-t border-graphite-700">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-graphite-800 border border-graphite-600">
          <div className="flex-1">
            <div className="text-[9px] font-semibold tracking-widest text-graphite-300 uppercase">N8N ENGINE</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">READY</span>
            </div>
          </div>
          <Zap size={14} className="text-graphite-400" />
        </div>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 text-graphite-300 hover:text-white transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-64 transform transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
