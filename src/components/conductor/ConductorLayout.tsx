import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { ConductorHome } from './ConductorHome';
import { RealGpsPanel } from './RealGpsPanel';
import { StartTripModal } from './StartTripModal';
import { ConductorProfile } from './ConductorProfile';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES, DHSGSU_UNIVERSITY_INFO } from '../../config/dhsguData';
import { Radio, ShieldCheck, User, ArrowLeft } from 'lucide-react';
import './ConductorLayout.css';

export const ConductorLayout: React.FC = () => {
  const { user, socket, login } = useBus();
  const [activeTab, setActiveTab] = useState<'console' | 'profile'>('console');
  const [isTripActive, setIsTripActive] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const assignedBusId = user?.assignedBusId || 'BUS_01';

  const handleStartTripConfirm = () => {
    setShowStartModal(false);

    // Emit start trip event to backend Socket.IO
    if (socket && socket.connected) {
      socket.emit('conductor:start-trip', {
        busId: assignedBusId,
        routeId: 'ROUTE_DHSGSU_01',
        conductorId: user?.id || 'AUTH_CONDUCTOR',
      });
    }

    setIsTripActive(true);
  };

  const handleEndTrip = () => {
    setIsTripActive(false);
  };

  return (
    <div className="conductor-shell">
      {/* Header Bar */}
      <header className="conductor-header">
        <div className="header-brand">
          <div className="op-logo-badge">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="op-header-title">CampusGo Conductor Panel</h1>
            <p className="op-header-sub">DHSGSU Sagar Transport Operations</p>
          </div>
        </div>

        <div className="header-right">
          <button
            className="switch-student-chip"
            onClick={() => login('DHSGSU-2024-1001', 'STUDENT')}
            title="Switch to Student Map Client"
          >
            <span>Student View →</span>
          </button>
        </div>
      </header>

      {/* Main Console */}
      <main className="conductor-main-area">
        {activeTab === 'console' && (
          <>
            {isTripActive ? (
              <RealGpsPanel
                busId={assignedBusId}
                socket={socket}
                onEndTrip={handleEndTrip}
              />
            ) : (
              <ConductorHome onStartTripClick={() => setShowStartModal(true)} />
            )}
          </>
        )}

        {activeTab === 'profile' && <ConductorProfile />}
      </main>

      {/* Consent Modal */}
      {showStartModal && (
        <StartTripModal
          busId={assignedBusId}
          routeName="CAMPUS ROUTE 1 (Main Gate → Central Library → Science Block → Hostels)"
          startingPoint="Gate No. 1 (Main Entrance)"
          onConfirm={handleStartTripConfirm}
          onClose={() => setShowStartModal(false)}
        />
      )}

      {/* Bottom Nav */}
      <nav className="conductor-nav-bar">
        <button
          className={`op-nav-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          <Radio size={20} />
          <span>Operator Panel</span>
        </button>

        <button
          className={`op-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>
    </div>
  );
};
