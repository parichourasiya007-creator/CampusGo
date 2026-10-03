import React, { useState, useEffect } from 'react';
import { useBus } from '../../context/BusContext';
import { GoogleMapView } from '../common/GoogleMapView';
import { MobileBottomSheet } from './MobileBottomSheet';
import { StudentRoutes } from './StudentRoutes';
import { StudentNotifications } from './StudentNotifications';
import { StudentProfile } from './StudentProfile';
import { OFFICIAL_STOPS } from '../../config/dhsguData';
import { Map, GitFork, MapPin, Bell, User, ShieldCheck } from 'lucide-react';
import './MobileStudentView.css';

export const MobileStudentView: React.FC = () => {
  const { activeBuses, selectedBusId, setSelectedBusId, notifications, login } = useBus();
  const [activeTab, setActiveTab] = useState<'home' | 'routes' | 'stops' | 'updates' | 'profile'>('home');

  const selectedBusState = activeBuses.find((b) => b.busId === selectedBusId);

  // Initialize and listen to browser history (hardware/browser BACK button)
  useEffect(() => {
    window.history.replaceState({ tab: 'home', busId: null }, '', window.location.pathname);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setActiveTab(event.state.tab || 'home');
        setSelectedBusId(event.state.busId || null);
      } else {
        setActiveTab('home');
        setSelectedBusId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedBusId]);

  // Handle Tab changes with browser history state push
  const handleTabChange = (newTab: 'home' | 'routes' | 'stops' | 'updates' | 'profile') => {
    if (newTab !== activeTab) {
      window.history.pushState({ tab: newTab, busId: selectedBusId }, '', `#${newTab}`);
      setActiveTab(newTab);
    }
  };

  // Handle Bus selection with browser history state push
  const handleBusSelect = (busId: string | null) => {
    if (busId !== selectedBusId) {
      if (busId) {
        window.history.pushState({ tab: activeTab, busId }, '', `#bus-${busId}`);
        setSelectedBusId(busId);
      } else {
        if (window.history.state && window.history.state.busId) {
          window.history.back();
        } else {
          setSelectedBusId(null);
        }
      }
    }
  };

  return (
    <div className="mobile-app-shell">
      {/* Compact Mobile Header */}
      <header className="mobile-header">
        <div className="m-brand-left">
          <span className="m-logo-emoji">🚌</span>
          <div>
            <h1 className="m-brand-title">
              {activeTab === 'home' && (selectedBusId ? `Bus ${selectedBusId}` : 'CampusGo')}
              {activeTab === 'routes' && 'Routes'}
              {activeTab === 'stops' && 'Campus Stops'}
              {activeTab === 'updates' && 'Live Updates'}
              {activeTab === 'profile' && 'My Profile'}
            </h1>
            <span className="m-brand-sub">DHSGSU Sagar</span>
          </div>
        </div>

        <button
          className="m-conductor-login-pill"
          onClick={() => login('EMP-DHSGSU-501', 'CONDUCTOR')}
        >
          <ShieldCheck size={14} />
          <span>Conductor</span>
        </button>
      </header>

      {/* Main Screen Content */}
      <main className="mobile-content-area">
        {activeTab === 'home' && (
          <div className="mobile-home-view">
            {/* Horizontal Compact Active Buses Strip */}
            <div className="mobile-active-buses-strip">
              {activeBuses.length === 0 ? (
                <div className="m-no-buses-pill">
                  <span className="live-dot-dim" /> No buses are currently active
                </div>
              ) : (
                activeBuses.map((bus) => (
                  <button
                    key={bus.busId}
                    className={`m-bus-chip ${selectedBusId === bus.busId ? 'selected' : ''}`}
                    onClick={() => handleBusSelect(bus.busId)}
                  >
                    <span className="live-dot" />
                    <strong>{bus.busId}</strong>
                    <span className="chip-eta">● LIVE</span>
                  </button>
                ))
              )}
            </div>

            {/* Dominant Map Canvas (Fills 100dvh - header - nav) */}
            <div className="mobile-map-hero-wrapper">
              <GoogleMapView
                activeBuses={activeBuses}
                selectedBusId={selectedBusId}
                onSelectBus={(busId) => handleBusSelect(busId)}
              />
            </div>

            {/* Selected Bus Draggable/Expandable Bottom Sheet Over Map */}
            {selectedBusState && (
              <MobileBottomSheet
                busState={selectedBusState}
                onClose={() => handleBusSelect(null)}
              />
            )}
          </div>
        )}

        {activeTab === 'routes' && (
          <StudentRoutes
            onSelectRoute={() => {
              handleTabChange('home');
            }}
          />
        )}

        {activeTab === 'stops' && (
          <div className="mobile-stops-view">
            <h3 className="section-title">Campus Shuttle Stops</h3>
            <div className="m-stops-list">
              {Object.values(OFFICIAL_STOPS).map((stop) => (
                <div key={stop.id} className="m-stop-card">
                  <MapPin size={18} className="text-live" />
                  <div>
                    <div className="m-stop-name">{stop.name}</div>
                    <div className="m-stop-desc">{stop.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'updates' && <StudentNotifications />}
        {activeTab === 'profile' && <StudentProfile />}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar (5 Items) */}
      <nav className="mobile-fixed-bottom-nav">
        <button
          className={`m-nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabChange('home')}
        >
          <Map size={20} />
          <span>Home</span>
        </button>

        <button
          className={`m-nav-tab ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => handleTabChange('routes')}
        >
          <GitFork size={20} />
          <span>Routes</span>
        </button>

        <button
          className={`m-nav-tab ${activeTab === 'stops' ? 'active' : ''}`}
          onClick={() => handleTabChange('stops')}
        >
          <MapPin size={20} />
          <span>Stops</span>
        </button>

        <button
          className={`m-nav-tab ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => handleTabChange('updates')}
        >
          <div className="m-nav-icon-wrap">
            <Bell size={20} />
            {notifications.length > 0 && <span className="m-nav-badge">{notifications.length}</span>}
          </div>
          <span>Updates</span>
        </button>

        <button
          className={`m-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
