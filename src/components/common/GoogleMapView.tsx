import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { DHSGSU_UNIVERSITY_INFO, OFFICIAL_STOPS, OFFICIAL_ROUTES } from '../../config/dhsguData';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import './GoogleMapView.css';

export interface LiveBusMapMarker {
  busId: string;
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number;
  timestamp?: number;
  routeId?: string;
}

interface GoogleMapViewProps {
  activeBuses: LiveBusMapMarker[];
  selectedBusId?: string | null;
  onSelectBus?: (busId: string) => void;
  showStops?: boolean;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  activeBuses,
  selectedBusId,
  onSelectBus,
  showStops = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setApiError("Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is required for Google Maps JS API tiles.");
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: DHSGSU_UNIVERSITY_INFO.campusCenter,
        zoom: DHSGSU_UNIVERSITY_INFO.defaultZoom,
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          { featureType: 'poi.school', elementType: 'labels', stylers: [{ visibility: 'on' }] },
          { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        ],
      });

      googleMapInstanceRef.current = map;
      setMapLoaded(true);

      // Render official campus stops
      if (showStops) {
        Object.values(OFFICIAL_STOPS).forEach((stop) => {
          new google.maps.Marker({
            position: { lat: stop.lat, lng: stop.lng },
            map: map,
            title: stop.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#0F1419',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          });
        });
      }

      // Render Route Polylines
      OFFICIAL_ROUTES.forEach((route) => {
        const path = route.waypoints.map((wp) => ({ lat: wp[0], lng: wp[1] }));
        new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#10B981',
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: map,
        });
      });

    }).catch((err) => {
      console.warn("Google Maps Loader Error:", err);
      setApiError("Could not initialize Google Maps Platform JavaScript API.");
    });
  }, [apiKey]);

  // ResizeObserver to trigger Google Maps resize behavior on container size change
  useEffect(() => {
    if (!mapRef.current || !googleMapInstanceRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (googleMapInstanceRef.current && window.google?.maps) {
        google.maps.event.trigger(googleMapInstanceRef.current, 'resize');
      }
    });

    resizeObserver.observe(mapRef.current);
    return () => resizeObserver.disconnect();
  }, [mapLoaded]);

  // Update active bus markers on Google Maps
  useEffect(() => {
    if (!googleMapInstanceRef.current || !mapLoaded) return;
    const map = googleMapInstanceRef.current;

    const existingMarkers = markersRef.current;
    const currentBusIds = new Set(activeBuses.map((b) => b.busId));

    // Remove markers no longer active
    for (const [busId, marker] of existingMarkers.entries()) {
      if (!currentBusIds.has(busId)) {
        marker.setMap(null);
        existingMarkers.delete(busId);
      }
    }

    // Add or update active markers
    activeBuses.forEach((bus) => {
      const pos = { lat: bus.lat, lng: bus.lng };
      if (existingMarkers.has(bus.busId)) {
        const marker = existingMarkers.get(bus.busId);
        marker.setPosition(pos);
      } else {
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: `Active Bus ${bus.busId}`,
          icon: {
            url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%230F1419" stroke="%2310B981" stroke-width="3"/><text x="20" y="24" font-size="14" font-weight="bold" fill="white" text-anchor="middle">🚌</text></svg>`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          },
        });

        marker.addListener('click', () => {
          if (onSelectBus) onSelectBus(bus.busId);
        });

        existingMarkers.set(bus.busId, marker);
      }

      if (selectedBusId === bus.busId) {
        map.panTo(pos);
      }
    });

  }, [activeBuses, selectedBusId, mapLoaded]);

  return (
    <div className="google-map-shell">
      {/* Real Google Map Container */}
      <div ref={mapRef} className="google-map-canvas" />

      {/* Fallback Notice if API key is missing */}
      {apiError && (
        <div className="gmaps-api-fallback-overlay">
          <div className="api-notice-card">
            <AlertCircle size={24} className="text-warning" />
            <div>
              <h4 className="notice-heading">Google Maps Platform Setup Required</h4>
              <p className="notice-body">
                Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in your environment configuration to render live Google Maps JavaScript API tiles for DHSGSU Sagar campus.
              </p>
              <div className="campus-coord-badge">
                <Navigation size={14} /> DHSGSU Sagar Lat 23.8327° N, 78.7816° E
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
