import React from 'react';
import { useBus } from '../../context/BusContext';
import { BUSES, ROUTES, STOPS } from '../../data/campusData';
import { TripControls } from './TripControls';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Wifi, Battery, Radio, ShieldCheck, Pause, Play, Square, RefreshCw } from 'lucide-react';
import './ActiveTripDashboard.css';

interface ActiveTripDashboardProps {
  busId: string;
}

export const ActiveTripDashboard: React.FC<ActiveTripDashboardProps> = ({ busId }) => {
  const { liveBuses, pauseTrip, resumeTrip, endTrip, toggleSimulationMode } = useBus();
  const busState = liveBuses[busId];
  const busInfo = BUSES.find((b) => b.id === busId) || BUSES[0];
  const route = ROUTES.find((r) => r.id === (busState?.routeId || busInfo.assignedRouteId)) || ROUTES[0];

  if (!busState) return null;

  const currentStop = STOPS[busState.currentStopId] || STOPS.LIBRARY;
  const nextStop = STOPS[busState.nextStopId] || STOPS.ACADEMIC_BLOCK;

  // Custom icon for Conductor "YOU ARE HERE"
  const conductorIcon = L.divIcon({
    className: 'conductor-gps-marker',
    html: `
      <div className="conductor-pin">
        🚌 YOU ARE HERE
      </div>
      <div className="conductor-pulse-ring"></div>
    `,
    iconSize: [120, 36],
    iconAnchor: [60, 18],
  });

  return (
    <div className="active-dashboard-container">
      {/* Header Bar */}
      <div className="active-header">
        <div className="active-title-group">
          <span className="live-status-badge">
            <span className="live-dot" /> LIVE TRACKING
          </span>
          <h2 className="active-bus-code">{busId} • {route.code}</h2>
        </div>

        <div className="header-actions">
          {busState.status === 'LIVE' ? (
            <button className="btn-icon-pause" onClick={() => pauseTrip(busId)} title="Pause location sharing">
              <Pause size={16} />
              <span>PAUSE</span>
            </button>
          ) : (
            <button className="btn-icon-resume" onClick={() => resumeTrip(busId)} title="Resume location sharing">
              <Play size={16} />
              <span>RESUME</span>
            </button>
          )}

          <button className="btn-icon-end" onClick={() => endTrip(busId)} title="End trip session">
            <Square size={16} />
            <span>END TRIP</span>
          </button>
        </div>
      </div>

      {/* Live Map Panel */}
      <div className="conductor-map-wrapper">
        <MapContainer
          center={[busState.currentLat, busState.currentLng]}
          zoom={16}
          zoomControl={false}
          className="conductor-leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {route.waypoints.length > 0 && (
            <Polyline positions={route.waypoints} pathOptions={{ color: '#10B981', weight: 6 }} />
          )}
          <Marker position={[busState.currentLat, busState.currentLng]} icon={conductorIcon} />
        </MapContainer>

        <div className="gps-source-badge">
          <Navigation size={14} className="text-live" />
          <span>PHONE GPS BROADCAST • ACCURACY 4M</span>
        </div>
      </div>

      {/* Operational Status Panel */}
      <div className="ops-status-panel">
        <div className="ops-stop-row">
          <div className="stop-box">
            <span className="box-label">CURRENT STOP</span>
            <span className="box-value">{currentStop.name}</span>
          </div>

          <div className="stop-box">
            <span className="box-label">NEXT STOP</span>
            <span className="box-value highlight">{nextStop.name}</span>
          </div>

          <div className="stop-box eta-box">
            <span className="box-label">ESTIMATED ARRIVAL</span>
            <span className="box-value text-live">{busState.etaMinutes} MIN</span>
          </div>
        </div>
      </div>

      {/* Telemetry Status Indicators */}
      <div className="telemetry-grid">
        <div className="telemetry-card">
          <Radio size={16} className="text-live" />
          <div>
            <div className="tel-label">GPS SIGNAL</div>
            <div className="tel-val text-live">● {busState.gpsSignal}</div>
          </div>
        </div>

        <div className="telemetry-card">
          <Wifi size={16} className="text-live" />
          <div>
            <div className="tel-label">INTERNET</div>
            <div className="tel-val text-live">● Connected</div>
          </div>
        </div>

        <div className="telemetry-card">
          <Battery size={16} />
          <div>
            <div className="tel-label">BATTERY</div>
            <div className="tel-val">{busState.batteryPercent}%</div>
          </div>
        </div>

        <div className="telemetry-card">
          <ShieldCheck size={16} className="text-live" />
          <div>
            <div className="tel-label">LOCATION SHARING</div>
            <div className="tel-val text-live">● ACTIVE</div>
          </div>
        </div>
      </div>

      {/* Controls: Stop Skip, Delay Reporter */}
      <TripControls busId={busId} />

      {/* Simulation Toggle Option for Demo */}
      <div className="simulation-bar">
        <span>GPS Simulator Mode (Auto Drive along route)</span>
        <button
          className={`sim-toggle-btn ${busState.isSimulated ? 'active' : ''}`}
          onClick={() => toggleSimulationMode(busId)}
        >
          <RefreshCw size={14} />
          <span>{busState.isSimulated ? 'Simulator: ON' : 'Simulator: OFF'}</span>
        </button>
      </div>
    </div>
  );
};
