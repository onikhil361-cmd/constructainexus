import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface PresentationModeContextValue {
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
}

const PresentationModeContext = createContext<PresentationModeContextValue | null>(null);

export function PresentationModeProvider({ children }: { children: ReactNode }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => !prev);
  };

  return (
    <PresentationModeContext.Provider value={{ isPresentationMode, togglePresentationMode }}>
      {children}
    </PresentationModeContext.Provider>
  );
}

export function usePresentationMode(): PresentationModeContextValue {
  const ctx = useContext(PresentationModeContext);
  if (!ctx) throw new Error('usePresentationMode must be used within PresentationModeProvider');
  return ctx;
}
