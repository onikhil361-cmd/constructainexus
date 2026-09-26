import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ScheduleIntelligencePage } from './pages/ScheduleIntelligencePage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { ProcurementPage } from './pages/ProcurementPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { AgentArchitecturePage } from './pages/AgentArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkflowProvider } from './hooks/useWorkflow';
import { DemoModeProvider } from './hooks/useDemoMode';
import { PresentationModeProvider } from './hooks/usePresentationMode';

export default function App() {
  return (
    <BrowserRouter>
      <DemoModeProvider>
        <PresentationModeProvider>
          <WorkflowProvider>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="schedule" element={<ScheduleIntelligencePage />} />
                <Route path="risk" element={<RiskIntelligencePage />} />
                <Route path="procurement" element={<ProcurementPage />} />
                <Route path="approvals" element={<ApprovalsPage />} />
                <Route path="audit" element={<AuditTrailPage />} />
                <Route path="architecture" element={<AgentArchitecturePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </WorkflowProvider>
        </PresentationModeProvider>
      </DemoModeProvider>
    </BrowserRouter>
  );
}
