import React from 'react';
import { useBus } from '../../context/BusContext';
import { GoogleMapView } from '../common/GoogleMapView';
import { DHSGSU_UNIVERSITY_INFO, OFFICIAL_STOPS } from '../../config/dhsguData';
import { Navigation, Compass, MapPin, Bus, AlertCircle } from 'lucide-react';
import './StudentMap.css';

export const StudentMap: React.FC = () => {
  const { activeBuses, selectedBusId, setSelectedBusId } = useBus();

  return (
    <div className="responsive-map-page">
      <div className="page-header">
        <h2 className="page-title">DHSGSU Campus Map</h2>
        <p className="page-subtitle">Interactive Google Maps view of Patharia Hills Campus & Live Transport</p>
      </div>

      {/* Main Responsive Google Map Wrapper */}
      <div className="map-view-hero-box">
        <GoogleMapView
          activeBuses={activeBuses}
          selectedBusId={selectedBusId}
          onSelectBus={(busId) => setSelectedBusId(busId)}
        />

        {/* Floating Compact Controls */}
        <div className="floating-map-badge">
          <span className="live-indicator">
            <span className="live-dot" />
            {activeBuses.length > 0 ? `${activeBuses.length} Active Shuttles` : 'Live Campus Map'}
          </span>
        </div>
      </div>

      {/* Campus Locations & Stops Explorer */}
      <div className="stops-summary-section">
        <h3 className="section-title">Official Campus Landmarks</h3>

        <div className="stops-grid">
          {Object.values(OFFICIAL_STOPS).map((stop) => (
            <div key={stop.id} className="stop-tile">
              <div className="stop-icon">
                <MapPin size={16} />
              </div>
              <div>
                <div className="stop-name">{stop.name}</div>
                <div className="stop-desc">{stop.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
