import React from 'react';
import { useBus } from '../../context/BusContext';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES } from '../../config/dhsguData';
import { Clock, ChevronRight, Bus, AlertCircle } from 'lucide-react';
import './NearbyBuses.css';

interface NearbyBusesProps {
  onSelectBus: (busId: string) => void;
  selectedBusId: string | null;
}

export const NearbyBuses: React.FC<NearbyBusesProps> = ({ onSelectBus, selectedBusId }) => {
  const { activeBuses } = useBus();

  return (
    <div className="nearby-buses-container">
      <div className="nearby-header">
        <h3 className="nearby-title">Active Campus Buses</h3>
        <span className="live-indicator">
          <span className="live-dot" />
          {activeBuses.length} Active
        </span>
      </div>

      {activeBuses.length === 0 ? (
        <div className="empty-active-buses-card">
          <AlertCircle size={22} className="empty-icon" />
          <div>
            <h4 className="empty-title">No buses are currently active.</h4>
            <p className="empty-desc">
              Live bus tracking updates will appear here automatically when a conductor starts an active trip on campus.
            </p>
          </div>
        </div>
      ) : (
        <div className="buses-list">
          {activeBuses.map((busState) => {
            const busInfo = OFFICIAL_BUSES.find((b) => b.id === busState.busId) || {
              id: busState.busId,
              busNumber: busState.busId,
              registrationNumber: 'DHSGSU Campus Transport',
            };
            const route = OFFICIAL_ROUTES.find((r) => r.id === busState.routeId) || OFFICIAL_ROUTES[0];
            const isSelected = selectedBusId === busState.busId;

            return (
              <div
                key={busState.busId}
                className={`bus-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectBus(busState.busId)}
              >
                <div className="bus-card-left">
                  <div className="bus-card-badge active">
                    🚌
                  </div>
                  <div className="bus-card-details">
                    <div className="bus-card-title-row">
                      <span className="bus-card-name">{busInfo.busNumber}</span>
                      <span className="status-tag live">
                        <span className="live-dot" /> LIVE
                      </span>
                    </div>
                    <div className="bus-card-route">{route.name}</div>
                  </div>
                </div>

                <div className="bus-card-right">
                  <div className="eta-badge">
                    <Clock size={14} />
                    <span>Real Location Streaming</span>
                  </div>
                  <ChevronRight size={18} className="chevron-icon" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
