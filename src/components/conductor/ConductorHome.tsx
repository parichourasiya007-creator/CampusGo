import React from 'react';
import { useBus } from '../../context/BusContext';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES } from '../../config/dhsguData';
import { Bus, Navigation, Play, ShieldCheck, MapPin } from 'lucide-react';
import './ConductorHome.css';

interface ConductorHomeProps {
  onStartTripClick: () => void;
}

export const ConductorHome: React.FC<ConductorHomeProps> = ({ onStartTripClick }) => {
  const { user } = useBus();
  const assignedBusId = user?.assignedBusId || 'BUS_01';
  const busInfo = OFFICIAL_BUSES.find((b) => b.id === assignedBusId) || OFFICIAL_BUSES[0];
  const route = OFFICIAL_ROUTES.find((r) => r.id === busInfo.assignedRouteId) || OFFICIAL_ROUTES[0];

  return (
    <div className="conductor-home">
      {/* Welcome Bar */}
      <div className="operator-welcome-bar">
        <div>
          <span className="welcome-tag">CAMPUSGO CONDUCTOR PANEL</span>
          <h2 className="welcome-title">{user?.name || 'Authorized Conductor'}</h2>
          <p className="welcome-sub">DHSGSU Sagar Transport Operations • Patharia Hills</p>
        </div>
        <div className="operator-badge-ring">
          <ShieldCheck size={24} className="text-live" />
        </div>
      </div>

      {/* Assignment Card */}
      <div className="assignment-card">
        <div className="assignment-header">
          <span className="card-section-label">ASSIGNED SHIFT DETAILS</span>
          <div className="status-pill offline">
            <span className="status-dot-dim" />
            <span>TRIP NOT ACTIVE</span>
          </div>
        </div>

        <div className="assignment-details">
          <div className="vehicle-block">
            <div className="vehicle-badge">{busInfo.busNumber}</div>
            <div>
              <h3 className="vehicle-name">Campus Bus {busInfo.busNumber}</h3>
              <div className="vehicle-reg">{busInfo.registrationNumber} • {busInfo.capacity} Seats</div>
            </div>
          </div>

          <div className="route-block">
            <div className="route-block-header">
              <MapPin size={16} className="text-live" />
              <span className="route-code">{route.code}</span>
            </div>
            <div className="route-name-str">{route.name}</div>
            <div className="route-stops-badge">{route.stops.length} Campus Stops Configured</div>
          </div>
        </div>

        <button className="start-trip-hero-btn" onClick={onStartTripClick}>
          <Play size={20} />
          <span>START TRIP</span>
        </button>
      </div>
    </div>
  );
};
