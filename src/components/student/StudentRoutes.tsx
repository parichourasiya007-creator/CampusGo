import React from 'react';
import { OFFICIAL_ROUTES } from '../../config/dhsguData';
import { useBus } from '../../context/BusContext';
import { MapPin, Bus, ArrowRight, Eye } from 'lucide-react';
import './StudentRoutes.css';

export const StudentRoutes: React.FC<{ onSelectRoute?: (routeId: string) => void }> = ({ onSelectRoute }) => {
  const { activeBuses } = useBus();

  return (
    <div className="routes-page">
      <div className="page-header">
        <h2 className="page-title">DHSGSU Campus Routes</h2>
        <p className="page-subtitle">Official Campus Shuttle Corridors • Dr. Harisingh Gour Vishwavidyalaya</p>
      </div>

      <div className="routes-grid">
        {OFFICIAL_ROUTES.map((route) => {
          const activeBusesCount = activeBuses.filter((b) => b.routeId === route.id).length;

          return (
            <div key={route.id} className="route-card">
              <div className="route-card-header">
                <div className="route-code-badge">
                  {route.code}
                </div>
                <div className="route-stats">
                  <span className="stat-pill">
                    <MapPin size={12} />
                    {route.stops.length} Stops
                  </span>
                  <span className={`stat-pill ${activeBusesCount > 0 ? 'active' : ''}`}>
                    <Bus size={12} />
                    {activeBusesCount} Active {activeBusesCount === 1 ? 'Shuttle' : 'Shuttles'}
                  </span>
                </div>
              </div>

              <h3 className="route-name">{route.name}</h3>

              <div className="route-stops-horizontal">
                {route.stops.map((stop, idx) => (
                  <React.Fragment key={stop.id}>
                    <span className="stop-chip">{stop.name}</span>
                    {idx < route.stops.length - 1 && <ArrowRight size={12} className="stop-arrow" />}
                  </React.Fragment>
                ))}
              </div>

              {onSelectRoute && (
                <div className="route-card-footer">
                  <button
                    className="view-route-btn"
                    onClick={() => onSelectRoute(route.id)}
                  >
                    <Eye size={16} />
                    <span>View Route on Map</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
