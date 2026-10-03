const OFFICIAL_STOPS = {
  GATE_1: { id: "GATE_1", name: "Gate No. 1 (Main Entrance)", code: "G1", lat: 23.8315, lng: 78.7780 },
  GOUR_BHAWAN: { id: "GOUR_BHAWAN", name: "Gour Bhawan / VC Office", code: "GB", lat: 23.8328, lng: 78.7802 },
  CENTRAL_LIBRARY: { id: "CENTRAL_LIBRARY", name: "Jawaharlal Nehru Central Library", code: "CL", lat: 23.8340, lng: 78.7820 },
  SCIENCE_BLOCK: { id: "SCIENCE_BLOCK", name: "School of Applied Sciences", code: "SB", lat: 23.8355, lng: 78.7845 },
  STUDENT_HOSTELS: { id: "STUDENT_HOSTELS", name: "Tagore & Rani Laxmibai Hostels", code: "SH", lat: 23.8385, lng: 78.7870 },
};

const OFFICIAL_ROUTES = [
  {
    id: "ROUTE_DHSGSU_01",
    code: "CAMPUS ROUTE 1",
    name: "Main Gate → Central Library → Science Block → Student Hostels",
    stops: Object.values(OFFICIAL_STOPS),
  },
];

const OFFICIAL_BUSES = [
  { id: "BUS_01", busNumber: "BUS 01", registrationNumber: "MP 15 UA 0101", capacity: 52, assignedRouteId: "ROUTE_DHSGSU_01" },
  { id: "BUS_02", busNumber: "BUS 02", registrationNumber: "MP 15 UA 0102", capacity: 48, assignedRouteId: "ROUTE_DHSGSU_01" },
];

class DatabaseStore {
  constructor() {
    this.buses = OFFICIAL_BUSES;
    this.routes = OFFICIAL_ROUTES;
    this.stops = OFFICIAL_STOPS;
    this.activeTrips = new Map();
    this.liveLocations = new Map();
    this.notifications = [];
  }

  getBuses() { return this.buses; }
  getRoutes() { return this.routes; }
  getStops() { return Object.values(this.stops); }

  getActiveTrips() {
    return Array.from(this.activeTrips.values());
  }

  getActiveTripByBus(busId) {
    return this.activeTrips.get(busId) || null;
  }

  startTrip(busId, conductorId, routeId) {
    const trip = {
      tripId: 'TRIP_' + Date.now(),
      busId,
      conductorId,
      routeId,
      startTime: new Date().toISOString(),
      status: 'ACTIVE',
    };
    this.activeTrips.set(busId, trip);
    return trip;
  }

  endTrip(busId) {
    const trip = this.activeTrips.get(busId);
    if (trip) {
      trip.status = 'ENDED';
      trip.endTime = new Date().toISOString();
      this.activeTrips.delete(busId);
      this.liveLocations.delete(busId);
    }
    return trip;
  }

  updateLiveLocation(busId, locationData) {
    const locationObj = {
      busId,
      lat: locationData.lat,
      lng: locationData.lng,
      accuracy: locationData.accuracy || 0,
      speed: locationData.speed || 0,
      timestamp: locationData.timestamp || Date.now(),
      lastUpdated: new Date().toISOString(),
    };
    this.liveLocations.set(busId, locationObj);
    return locationObj;
  }

  getLiveLocation(busId) {
    return this.liveLocations.get(busId) || null;
  }

  getAllLiveLocations() {
    const result = [];
    for (const [busId, loc] of this.liveLocations.entries()) {
      const trip = this.activeTrips.get(busId);
      if (trip && trip.status === 'ACTIVE') {
        result.push({ ...loc, routeId: trip.routeId });
      }
    }
    return result;
  }

  addNotification(title, message, type = 'info', busId = null) {
    const note = {
      id: 'NOTE_' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      busId,
    };
    this.notifications.unshift(note);
    if (this.notifications.length > 50) this.notifications.pop();
    return note;
  }

  getNotifications() {
    return this.notifications;
  }
}

export default new DatabaseStore();
