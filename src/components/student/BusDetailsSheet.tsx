import React from 'react';
import { useBus, LiveBusState } from '../../context/BusContext';
import { BUSES, ROUTES, STOPS } from '../../data/campusData';
import { Clock, MapPin, Navigation, ArrowRight, ShieldCheck, X } from 'lucide-react';
import './BusDetailsSheet.css';

interface BusDetailsSheetProps {
  busId: string;
  onClose: () => void;
  onFollowBus?: () => void;
}

export const BusDetailsSheet: React.FC<BusDetailsSheetProps> = ({ busId, onClose, onFollowBus }) => {
  const { liveBuses } = useBus();
  const busState = liveBuses[busId];
  const busInfo = BUSES.find((b) => b.id === busId) || BUSES[0];
  const route = ROUTES.find((r) => r.id === (busState?.routeId || busInfo.assignedRouteId)) || ROUTES[0];

  if (!busState) return null;

  const currentStop = STOPS[busState.currentStopId] || STOPS.LIBRARY;
  const nextStop = STOPS[busState.nextStopId] || STOPS.ACADEMIC_BLOCK;

  return (
    <div className="bus-details-sheet">
      {/* Header bar */}
      <div className="sheet-header">
        <div className="sheet-title-group">
          <div className="bus-badge-lg">{busState.busId}</div>
          <div>
            <h2 className="bus-name">{busInfo.name}</h2>
            <div className="bus-route-code">{route.code}</div>
          </div>
        </div>

        <div className="sheet-right-group">
          <div className={`status-pill ${busState.status.toLowerCase()}`}>
            <span className="live-dot" />
            <span>{busState.status}</span>
          </div>
          <button className="close-sheet-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Current Location</div>
          <div className="metric-value">
            <MapPin size={16} className="text-live" />
            <span>{currentStop.name}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Next Stop</div>
          <div className="metric-value">
            <ArrowRight size={16} className="text-muted" />
            <span>{nextStop.name}</span>
          </div>
        </div>

        <div className="metric-card highlight">
          <div className="metric-label">Estimated Arrival</div>
          <div className="metric-value eta">
            <Clock size={16} />
            <span>{busState.etaMinutes} min</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Distance</div>
          <div className="metric-value">
            <Navigation size={16} />
            <span>{busState.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Conductor & Telemetry status notice */}
      <div className="conductor-telemetry-strip">
        <ShieldCheck size={16} className="text-live" />
        <span>Conductor Phone GPS Broadcasting LIVE • Updated {busState.lastUpdatedTime}</span>
      </div>

      {/* Route Stops Vertical Timeline */}
      <div className="route-timeline-section">
        <h3 className="section-title">Live Route Progress</h3>
        
        <div className="vertical-timeline">
          {route.stops.map((stop, index) => {
            const isCurrent = stop.id === currentStop.id;
            const isNext = stop.id === nextStop.id;
            const isPassed = index < route.stops.findIndex((s) => s.id === currentStop.id);

            return (
              <div
                key={stop.id}
                className={`timeline-item ${isCurrent ? 'is-current' : ''} ${isNext ? 'is-next' : ''} ${isPassed ? 'is-passed' : ''}`}
              >
                <div className="timeline-node">
                  {isCurrent ? (
                    <div className="bus-timeline-icon">🚌</div>
                  ) : (
                    <div className="node-dot" />
                  )}
                  {index < route.stops.length - 1 && <div className="timeline-line" />}
                </div>

                <div className="timeline-content">
                  <div className="stop-name-row">
                    <span className="timeline-stop-name">{stop.name}</span>
                    {isCurrent && <span className="current-tag">CURRENT LOCATION</span>}
                    {isNext && <span className="next-tag">NEXT STOP ({busState.etaMinutes} min)</span>}
                  </div>
                  <span className="stop-desc">{stop.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="sheet-actions">
        <button className="action-btn primary" onClick={onFollowBus}>
          <Navigation size={18} />
          <span>Follow Bus on Map</span>
        </button>
        <button className="action-btn secondary" onClick={onClose}>
          <span>View Full Route</span>
        </button>
      </div>
    </div>
  );
};
