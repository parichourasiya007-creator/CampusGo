import React from 'react';
import { BusProvider, useBus } from './context/BusContext';
import { AuthScreen } from './components/AuthScreen';
import { StudentLayout } from './components/student/StudentLayout';
import { ConductorLayout } from './components/conductor/ConductorLayout';
import './App.css';

const AppContent: React.FC = () => {
  const { role } = useBus();

  return (
    <div className="app-root-shell">
      {role === 'STUDENT' && <StudentLayout />}
      {role === 'CONDUCTOR' && <ConductorLayout />}
      {role === null && <AuthScreen />}
    </div>
  );
};

export default function App() {
  return (
    <BusProvider>
      <AppContent />
    </BusProvider>
  );
}
