import React, { useState } from 'react';
import { RealBusState } from '../../context/BusContext';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES, OFFICIAL_STOPS } from '../../config/dhsguData';
import { MapPin, Navigation, Clock, X, ChevronUp, ChevronDown, ShieldCheck } from 'lucide-react';
import './MobileBottomSheet.css';

interface MobileBottomSheetProps {
  busState: RealBusState;
  onClose: () => void;
  onFollowBus?: () => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  busState,
  onClose,
  onFollowBus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const busInfo = OFFICIAL_BUSES.find((b) => b.id === busState.busId) || {
    id: busState.busId,
    busNumber: busState.busId,
    registrationNumber: 'DHSGSU Campus Transport',
  };
  const route = OFFICIAL_ROUTES.find((r) => r.id === busState.routeId) || OFFICIAL_ROUTES[0];

  const currentStop = OFFICIAL_STOPS.CENTRAL_LIBRARY;
  const nextStop = OFFICIAL_STOPS.SCIENCE_BLOCK;

  return (
    <div className={`mobile-bottom-sheet ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Drag Handle Bar */}
      <div className="sheet-drag-handle-bar" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="drag-handle-pill" />
        <button className="expand-toggle-btn">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Main Sheet Header */}
      <div className="sheet-main-header">
        <div className="sheet-bus-badge">
          🚌 {busInfo.busNumber}
        </div>

        <div className="sheet-title-info">
          <div className="live-status-pill">
            <span className="live-dot" /> LIVE LOCATION
          </div>
          <h3 className="sheet-route-name">{route.name}</h3>
        </div>

        <button className="sheet-close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Quick Location Metrics Grid */}
      <div className="sheet-metrics-row">
        <div className="s-metric-box">
          <span className="s-label">CURRENT LOCATION</span>
          <span className="s-val"><MapPin size={14} className="text-live" /> {currentStop.name}</span>
        </div>

        <div className="s-metric-box">
          <span className="s-label">NEXT STOP</span>
          <span className="s-val">{nextStop.name}</span>
        </div>

        <div className="s-metric-box highlight">
          <span className="s-label">ESTIMATED ETA</span>
          <span className="s-val text-live"><Clock size={14} /> 4 min</span>
        </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="sheet-expanded-details">
          <div className="privacy-telemetry-strip">
            <ShieldCheck size={16} className="text-live" />
            <span>Bus GPS Broadcasting LIVE • Updated Just Now</span>
          </div>

          <div className="route-timeline">
            <h4 className="timeline-title">Route Stops Progress</h4>
            <div className="timeline-stops">
              {route.stops.map((stop, idx) => (
                <div key={stop.id} className="timeline-stop-item">
                  <div className="node-icon">{idx === 1 ? '🚌' : '•'}</div>
                  <div className="stop-name">{stop.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action CTA */}
      <div className="sheet-actions">
        <button className="btn-follow-bus" onClick={onFollowBus}>
          <Navigation size={18} />
          <span>Follow Bus on Map</span>
        </button>
      </div>
    </div>
  );
};
