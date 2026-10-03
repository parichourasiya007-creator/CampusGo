import db from '../db.js';

export default function initTrackingHandler(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New connection: ${socket.id}`);

    socket.join('campus:dhsgsu');

    socket.on('student:subscribe', () => {
      const activeLocations = db.getAllLiveLocations();
      socket.emit('student:initial-state', {
        activeBuses: activeLocations,
        notifications: db.getNotifications(),
      });
    });

    socket.on('conductor:start-trip', (data) => {
      const { busId, routeId, conductorId } = data;
      if (!busId || !routeId) return;

      const trip = db.startTrip(busId, conductorId || 'AUTH_CONDUCTOR', routeId);
      const note = db.addNotification(`${busId} Started Trip`, `${busId} is now active on its assigned route.`, 'success', busId);

      io.to('campus:dhsgsu').emit('student:trip-started', {
        busId,
        routeId,
        tripId: trip.tripId,
        timestamp: trip.startTime,
      });

      io.to('campus:dhsgsu').emit('student:notification', note);
      console.log(`[Socket.IO] Conductor started trip for ${busId}`);
    });

    socket.on('conductor:update-location', (data) => {
      const { busId, lat, lng, accuracy, speed, timestamp } = data;
      if (!busId || lat == null || lng == null) return;

      const activeTrip = db.getActiveTripByBus(busId);
      if (!activeTrip) return;

      const liveLoc = db.updateLiveLocation(busId, { lat, lng, accuracy, speed, timestamp });

      io.to('campus:dhsgsu').emit('student:bus-location-changed', {
        busId,
        routeId: activeTrip.routeId,
        lat: liveLoc.lat,
        lng: liveLoc.lng,
        accuracy: liveLoc.accuracy,
        speed: liveLoc.speed,
        timestamp: liveLoc.timestamp,
        lastUpdated: liveLoc.lastUpdated,
      });
    });

    socket.on('conductor:report-delay', (data) => {
      const { busId, reason, minutes } = data;
      if (!busId) return;

      const note = db.addNotification(`${busId} Delayed`, `Reason: ${reason || 'Traffic'} (+${minutes || 5} min)`, 'warning', busId);
      io.to('campus:dhsgsu').emit('student:notification', note);
    });

    socket.on('conductor:end-trip', (data) => {
      const { busId } = data;
      if (!busId) return;

      db.endTrip(busId);
      const note = db.addNotification(`${busId} Ended Trip`, `${busId} has completed its trip and is now inactive.`, 'info', busId);

      io.to('campus:dhsgsu').emit('student:trip-ended', { busId });
      io.to('campus:dhsgsu').emit('student:notification', note);
      console.log(`[Socket.IO] Conductor ended trip for ${busId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Connection disconnected: ${socket.id}`);
    });
  });
}
