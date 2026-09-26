import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface DemoModeContextValue {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (val: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('constructai_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      try { localStorage.setItem('constructai_demo_mode', String(next)); } catch {}
      return next;
    });
  };

  const setDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    try { localStorage.setItem('constructai_demo_mode', String(val)); } catch {}
  };

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
}
