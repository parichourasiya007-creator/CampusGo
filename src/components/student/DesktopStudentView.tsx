import React, { useState, useEffect } from 'react';
import { useBus } from '../../context/BusContext';
import { DesktopHeader } from '../layout/DesktopHeader';
import { GoogleMapView } from '../common/GoogleMapView';
import { StudentRoutes } from './StudentRoutes';
import { StudentNotifications } from './StudentNotifications';
import { OFFICIAL_STOPS, OFFICIAL_ROUTES } from '../../config/dhsguData';
import { MapPin, Bus, Clock, Gauge, ChevronRight, X, AlertTriangle } from 'lucide-react';
import './DesktopStudentView.css';

export const DesktopStudentView: React.FC = () => {
  const { activeBuses, selectedBusId, setSelectedBusId } = useBus();
  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'stops' | 'updates'>('map');

  const selectedBusState = activeBuses.find((b) => b.busId === selectedBusId);
  const activeRoute = selectedBusState
    ? OFFICIAL_ROUTES.find((r) => r.id === selectedBusState.assignedRouteId) || OFFICIAL_ROUTES[0]
    : null;

  // History sync for Desktop Browser Back button
  useEffect(() => {
    window.history.replaceState({ tab: 'map', busId: null }, '', window.location.pathname);

    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setActiveTab(e.state.tab || 'map');
        setSelectedBusId(e.state.busId || null);
      } else {
        setActiveTab('map');
        setSelectedBusId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedBusId]);

  const handleTabChange = (newTab: 'map' | 'routes' | 'stops' | 'updates') => {
    if (newTab !== activeTab) {
      window.history.pushState({ tab: newTab, busId: selectedBusId }, '', `#${newTab}`);
      setActiveTab(newTab);
    }
  };

  return (
    <div className="desktop-student-shell">
      {/* Top Desktop Navigation Bar */}
      <DesktopHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Desktop Split Layout */}
      <main className="desktop-main-layout">
        {activeTab === 'map' && (
          <div className="desktop-split-container">
            {/* Left 68% Google Map Column */}
            <div className="desktop-map-column">
              <GoogleMapView
                activeBuses={activeBuses}
                selectedBusId={selectedBusId}
                onSelectBus={(busId) => setSelectedBusId(busId)}
              />
            </div>

            {/* Right 32% Side Control & Details Column */}
            <aside className="desktop-side-column">
              <div className="d-panel-header">
                <div className="d-panel-title">
                  <Bus size={20} className="text-live" />
                  <span>Active Campus Shuttles</span>
                </div>
                <div className="d-live-status-pill">
                  <span className="live-dot" /> REAL GPS
                </div>
              </div>

              {/* Selected Bus Detailed Drawer Panel */}
              {selectedBusState ? (
                <div className="d-selected-bus-detail">
                  <div className="d-detail-top">
                    <div>
                      <div className="d-bus-id">
                        🚌 {selectedBusState.busId}
                        <span className="d-bus-badge">ACTIVE</span>
                      </div>
                      <div className="d-bus-route-name">
                        {activeRoute?.code} • {activeRoute?.name}
                      </div>
                    </div>
                    <button className="d-close-btn" onClick={() => setSelectedBusId(null)} title="Close Panel">
                      <X size={16} />
                    </button>
                  </div>

                  {/* ETA Hero Highlight Box */}
                  <div className="d-eta-hero-box">
                    <div className="d-eta-left">
                      <span className="d-eta-label">Approaching Next Stop</span>
                      <div className="d-next-stop-name">
                        📍 {selectedBusState.nextStopName || 'Science Block'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="d-eta-label">Estimated Time</span>
                      <div className="d-eta-val">{selectedBusState.etaMinutes || 3} mins</div>
                    </div>
                  </div>

                  {/* Realtime Speed & Status metrics */}
                  <div className="d-bus-metrics">
                    <div className="d-metric-item">
                      <Gauge size={16} />
                      <span>{Math.round(selectedBusState.speed || 0)} km/h</span>
                    </div>
                    <div className="d-metric-item">
                      <Clock size={16} />
                      <span>Updated live</span>
                    </div>
                  </div>

                  {/* Stop-by-stop Timeline */}
                  {activeRoute && (
                    <div style={{ marginTop: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        ROUTE PROGRESS
                      </h4>
                      <div className="d-stop-timeline">
                        {activeRoute.stops.map((stop) => {
                          const isNext = stop.name === selectedBusState.nextStopName;
                          return (
                            <div
                              key={stop.id}
                              className={`d-timeline-node ${isNext ? 'next' : ''}`}
                            >
                              <div className="d-timeline-dot" />
                              <span>{stop.name}</span>
                              {isNext && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3B82F6', marginLeft: 'auto' }}>NEXT</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* List of All Active Buses */
                <div className="d-buses-grid">
                  {activeBuses.length === 0 ? (
                    <div className="d-empty-buses-state">
                      <AlertTriangle size={32} style={{ color: 'var(--text-muted)' }} />
                      <h4 style={{ fontWeight: 800, margin: 0 }}>No Buses Active On Campus</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                        Conductor app must broadcast live location to display active shuttles.
                      </p>
                    </div>
                  ) : (
                    activeBuses.map((bus) => (
                      <div
                        key={bus.busId}
                        className={`d-bus-card ${selectedBusId === bus.busId ? 'selected' : ''}`}
                        onClick={() => setSelectedBusId(bus.busId)}
                      >
                        <div className="d-bus-header">
                          <div className="d-bus-id">
                            🚌 {bus.busId}
                          </div>
                          <span className="d-bus-badge">ONLINE</span>
                        </div>
                        <div className="d-bus-route-name">
                          Next: <strong>{bus.nextStopName || 'Central Library'}</strong>
                        </div>
                        <div className="d-bus-metrics">
                          <div className="d-metric-item">
                            <Clock size={14} />
                            <span>ETA: ~{bus.etaMinutes || 4} mins</span>
                          </div>
                          <div className="d-metric-item" style={{ marginLeft: 'auto', color: 'var(--color-live)', fontWeight: 800 }}>
                            Select Bus <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Campus Stops Quick Access Block */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  DHSGSU CAMPUS STOPS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.values(OFFICIAL_STOPS).slice(0, 4).map((s) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                      <MapPin size={14} style={{ color: 'var(--color-live)' }} />
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'routes' && (
          <div style={{ width: '100%', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <StudentRoutes onSelectRoute={() => handleTabChange('map')} />
          </div>
        )}

        {activeTab === 'stops' && (
          <div style={{ width: '100%', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontWeight: 800, margin: 0 }}>DHSGSU Campus Shuttle Stops</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {Object.values(OFFICIAL_STOPS).map((stop) => (
                <div key={stop.id} className="d-bus-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={24} style={{ color: 'var(--color-live)' }} />
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 800 }}>{stop.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {stop.code}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {stop.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div style={{ width: '100%', height: '100%', padding: '24px', overflowY: 'auto' }}>
            <StudentNotifications />
          </div>
        )}
      </main>
    </div>
  );
};
