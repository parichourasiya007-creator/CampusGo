import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useBus } from '../../context/BusContext';
import { UNIVERSITY_INFO, STOPS, ROUTES } from '../../data/campusData';
import { Navigation, Compass } from 'lucide-react';
import './LiveMap.css';

// Helper component to center map on active bus when requested
const MapController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
};

export const LiveMap: React.FC<{
  selectedBusId: string | null;
  onSelectBus: (busId: string) => void;
}> = ({ selectedBusId, onSelectBus }) => {
  const { liveBuses } = useBus();

  const activeBus = selectedBusId ? liveBuses[selectedBusId] : null;

  // Selected route polyline coordinates
  const activeRoute = activeBus ? ROUTES.find((r) => r.id === activeBus.routeId) : null;
  const polylineCoords = activeRoute ? activeRoute.waypoints : [];

  // Create custom DivIcon for Bus marker
  const createBusIcon = (busId: string, isLive: boolean, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div className="bus-marker-pin ${isSelected ? 'is-selected' : ''}">
          🚌 ${busId}
        </div>
        ${isLive ? '<div className="bus-marker-pulse"></div>' : ''}
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  // Create custom DivIcon for Stop marker
  const createStopIcon = (stopName: string) => {
    return L.divIcon({
      className: 'custom-stop-marker',
      html: `
        <div className="stop-dot"></div>
        <div className="stop-label">${stopName}</div>
      `,
      iconSize: [100, 20],
      iconAnchor: [6, 10],
    });
  };

  const centerPosition: [number, number] = activeBus && activeBus.status === 'LIVE'
    ? [activeBus.currentLat, activeBus.currentLng]
    : UNIVERSITY_INFO.center;

  return (
    <div className="live-map-container">
      <MapContainer
        center={UNIVERSITY_INFO.center}
        zoom={UNIVERSITY_INFO.zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Dynamic Map FlyTo controller */}
        <MapController center={centerPosition} />

        {/* Route Polyline */}
        {polylineCoords.length > 0 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: activeRoute?.color || '#10B981',
              weight: 5,
              opacity: 0.8,
              dashArray: '1, 2',
            }}
          />
        )}

        {/* Campus Stop Markers */}
        {Object.values(STOPS).map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={createStopIcon(stop.name)}
          >
            <Popup className="stop-popup">
              <div>
                <strong>{stop.name}</strong>
                <p>{stop.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Bus Markers */}
        {Object.values(liveBuses).map((bus) => {
          const isSelected = bus.busId === selectedBusId;
          const isLive = bus.status === 'LIVE' || bus.status === 'DELAYED';

          return (
            <Marker
              key={bus.busId}
              position={[bus.currentLat, bus.currentLng]}
              icon={createBusIcon(bus.busId, isLive, isSelected)}
              eventHandlers={{
                click: () => onSelectBus(bus.busId),
              }}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>{bus.busId}</strong>
                  <div className="live-indicator" style={{ marginTop: '4px' }}>
                    <span className="live-dot" />
                    <span>{bus.status}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Overlays */}
      <div className="map-badge-top">
        <span className="live-indicator">
          <span className="live-dot" />
          Live Campus Transport
        </span>
      </div>

      <button
        className="recenter-btn"
        onClick={() => {
          if (selectedBusId && liveBuses[selectedBusId]) {
            // center on selected bus
          }
        }}
        title="Recenter on campus"
      >
        <Compass size={20} />
      </button>
    </div>
  );
};
