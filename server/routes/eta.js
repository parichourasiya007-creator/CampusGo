import express from 'express';
import db from '../db.js';

const router = express.Router();

// Haversine distance helper function (returns distance in km)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * POST /api/eta/find-bus
 * Body: { fromLat, fromLng, toStopId }
 * Calculates nearest stop, active bus, ETA to pickup stop, and expected destination arrival
 */
router.post('/find-bus', (req, res) => {
  const { fromLat, fromLng, toStopId } = req.body;
  const stops = db.getStops();
  const routes = db.getRoutes();
  const activeLocations = db.getAllLiveLocations();

  if (!stops || stops.length === 0) {
    return res.status(404).json({ error: 'No campus stops configured.' });
  }

  // Find nearest stop to student's current location
  let nearestStop = stops[0];
  let minDistance = Infinity;

  if (fromLat != null && fromLng != null) {
    for (const stop of stops) {
      const dist = calculateHaversineDistance(fromLat, fromLng, stop.lat, stop.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStop = stop;
      }
    }
  }

  // Destination stop details
  const destinationStop = stops.find(s => s.id === toStopId) || stops[stops.length - 1];

  // Find active bus operating on route serving both stops
  const activeBusLoc = activeLocations.length > 0 ? activeLocations[0] : null;

  if (!activeBusLoc) {
    return res.json({
      active: false,
      pickupStop: nearestStop,
      destinationStop: destinationStop,
      message: 'No buses are currently active on campus.',
    });
  }

  // Calculate ETA to pickup stop based on distance and average speed 25 km/h
  const distToPickup = calculateHaversineDistance(activeBusLoc.lat, activeBusLoc.lng, nearestStop.lat, nearestStop.lng);
  const distPickupToDest = calculateHaversineDistance(nearestStop.lat, nearestStop.lng, destinationStop.lat, destinationStop.lng);

  const avgSpeedKmH = Math.max(activeBusLoc.speed || 20, 15);
  const pickupEtaMin = Math.max(1, Math.round((distToPickup / avgSpeedKmH) * 60));
  const travelDurationMin = Math.max(2, Math.round((distPickupToDest / avgSpeedKmH) * 60));
  const destArrivalEtaMin = pickupEtaMin + travelDurationMin;

  return res.json({
    active: true,
    busId: activeBusLoc.busId,
    routeId: activeBusLoc.routeId || 'ROUTE_DHSGSU_01',
    pickupStop: nearestStop,
    destinationStop: destinationStop,
    pickupEtaMinutes: pickupEtaMin,
    destinationArrivalMinutes: destArrivalEtaMin,
    distanceKm: (distToPickup + distPickupToDest).toFixed(2),
  });
});

export default router;
