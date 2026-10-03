import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES, OFFICIAL_STOPS } from '../../config/dhsguData';
import { Navigation, AlertTriangle, Square, ShieldCheck, Radio, Signal } from 'lucide-react';
import './RealGpsPanel.css';

interface RealGpsPanelProps {
  busId: string;
  socket: Socket | null;
  onEndTrip: () => void;
}

interface LocationState {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  timestamp: number;
}

export const RealGpsPanel: React.FC<RealGpsPanelProps> = ({ busId, socket, onEndTrip }) => {
  const [currentLoc, setCurrentLoc] = useState<LocationState | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  const busInfo = OFFICIAL_BUSES.find((b) => b.id === busId) || OFFICIAL_BUSES[0];
  const route = OFFICIAL_ROUTES.find((r) => r.id === busInfo.assignedRouteId) || OFFICIAL_ROUTES[0];

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('HTML5 Geolocation is not supported on this device/browser.');
      return;
    }

    // Start watching real device GPS position continuously
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed } = position.coords;
      const loc: LocationState = {
        lat: latitude,
        lng: longitude,
        accuracy: Math.round(accuracy),
        speed: speed ? Math.round(speed * 3.6) : 0, // m/s to km/h
        timestamp: position.timestamp,
      };

      setCurrentLoc(loc);
      setGpsError(null);
      setUpdateCount((c) => c + 1);

      // Emit real GPS position to backend Socket.IO (Strictly as Bus Location)
      if (socket && socket.connected) {
        socket.emit('conductor:update-location', {
          busId,
          lat: loc.lat,
          lng: loc.lng,
          accuracy: loc.accuracy,
          speed: loc.speed,
          timestamp: loc.timestamp,
        });
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setGpsError('Location permission is required to start live bus tracking.');
          break;
        case error.POSITION_UNAVAILABLE:
          setGpsError('Unable to determine the current bus location.');
          break;
        case error.TIMEOUT:
          setGpsError('Location request timed out. Retrying GPS lock...');
          break;
        default:
          setGpsError('An unknown error occurred while retrieving GPS coordinates.');
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [busId, socket]);

  const handleConfirmEndTrip = () => {
    if (window.confirm('End this bus trip?\nLive bus location broadcasting will stop.')) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (socket && socket.connected) {
        socket.emit('conductor:end-trip', { busId });
      }

      onEndTrip();
    }
  };

  return (
    <div className="real-gps-panel">
      {/* Live Header Banner */}
      <div className="gps-active-banner">
        <div className="banner-left">
          <span className="live-dot" />
          <h2 className="live-title">LIVE BUS LOCATION SHARING</h2>
        </div>
        <button className="btn-end-trip-confirm" onClick={handleConfirmEndTrip}>
          <Square size={16} />
          <span>END TRIP</span>
        </button>
      </div>

      {/* Error Notice */}
      {gpsError && (
        <div className="gps-error-card">
          <AlertTriangle size={20} className="text-danger" />
          <div>
            <h4 className="error-title">GPS Error</h4>
            <p className="error-msg">{gpsError}</p>
          </div>
        </div>
      )}

      {/* Active Vehicle & Route Panel */}
      <div className="vehicle-route-info-card">
        <div className="v-row">
          <span className="v-label">Assigned Vehicle</span>
          <span className="v-val text-live">🚌 {busInfo.busNumber} ({busInfo.registrationNumber})</span>
        </div>
        <div className="v-row">
          <span className="v-label">Operating Route</span>
          <span className="v-val">{route.name}</span>
        </div>
      </div>

      {/* Telemetry Real Position Grid */}
      <div className="real-telemetry-grid">
        <div className="tel-card">
          <Navigation size={18} className="text-live" />
          <div>
            <div className="t-label">CURRENT LOCATION</div>
            <div className="t-val">
              {currentLoc ? `${currentLoc.lat.toFixed(4)}°, ${currentLoc.lng.toFixed(4)}°` : 'Acquiring GPS...'}
            </div>
          </div>
        </div>

        <div className="tel-card">
          <Signal size={18} className="text-live" />
          <div>
            <div className="t-label">GPS ACCURACY</div>
            <div className="t-val">{currentLoc ? `±${currentLoc.accuracy} meters` : 'Searching...'}</div>
          </div>
        </div>

        <div className="tel-card">
          <Radio size={18} className="text-live" />
          <div>
            <div className="t-label">UPDATES SENT</div>
            <div className="t-val">{updateCount} position pings</div>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="privacy-guarantee-note">
        <ShieldCheck size={16} className="text-live" />
        <span>Your device's location is published strictly as <strong>BUS 01 LOCATION</strong>. Conductor personal info is never exposed.</span>
      </div>
    </div>
  );
};
