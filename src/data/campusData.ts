export interface CampusStop {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  description: string;
}

export interface CampusRoute {
  id: string;
  code: string;
  name: string;
  color: string;
  description: string;
  stops: CampusStop[];
  waypoints: [number, number][]; // Detailed polyline coordinates
}

export interface BusInfo {
  id: string; // e.g. "B-01"
  name: string; // e.g. "Campus Shuttle"
  registrationNumber: string;
  capacity: number;
  assignedRouteId: string;
  conductorName: string;
  conductorPhone: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  busId: string;
  busName: string;
  routeId: string;
  routeName: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export const UNIVERSITY_INFO = {
  name: "Dr. Harisingh Gour Vishwavidyalaya",
  shortName: "DHSGV",
  location: "Sagar, Madhya Pradesh",
  center: [23.8355, 78.7838] as [number, number],
  zoom: 15,
};

export const STOPS: Record<string, CampusStop> = {
  MAIN_GATE: {
    id: "MAIN_GATE",
    name: "Main Gate",
    code: "MG",
    lat: 23.8322,
    lng: 78.7801,
    description: "Primary entrance & city transport transit point",
  },
  LIBRARY: {
    id: "LIBRARY",
    name: "University Library",
    code: "UL",
    lat: 23.8345,
    lng: 78.7818,
    description: "Central library & reading complex",
  },
  ACADEMIC_BLOCK: {
    id: "ACADEMIC_BLOCK",
    name: "Academic Block",
    code: "AB",
    lat: 23.8368,
    lng: 78.7842,
    description: "Engineering & Science departments building",
  },
  HOSTEL_BLOCK: {
    id: "HOSTEL_BLOCK",
    name: "Hostel Block",
    code: "HB",
    lat: 23.8390,
    lng: 78.7875,
    description: "Student hostels & residential zone",
  },
  CANTEEN: {
    id: "CANTEEN",
    name: "Central Canteen",
    code: "CC",
    lat: 23.8375,
    lng: 78.7830,
    description: "Campus cafeteria & dining hub",
  },
  SPORTS_COMPLEX: {
    id: "SPORTS_COMPLEX",
    name: "Sports Complex",
    code: "SC",
    lat: 23.8335,
    lng: 78.7860,
    description: "Stadium, gymnasium & athletics facility",
  },
  ADMIN_BLOCK: {
    id: "ADMIN_BLOCK",
    name: "Administrative Block",
    code: "AD",
    lat: 23.8350,
    lng: 78.7850,
    description: "Vice-Chancellor office, registrar & admin services",
  },
};

export const ROUTES: CampusRoute[] = [
  {
    id: "ROUTE_01",
    code: "ROUTE 01",
    name: "Main Gate → Library → Academic Block → Hostel",
    color: "#10B981", // Emerald Live
    description: "Main campus trunk line serving primary academic facilities",
    stops: [
      STOPS.MAIN_GATE,
      STOPS.LIBRARY,
      STOPS.ACADEMIC_BLOCK,
      STOPS.HOSTEL_BLOCK,
    ],
    waypoints: [
      [23.8322, 78.7801], // Main Gate
      [23.8330, 78.7808],
      [23.8345, 78.7818], // Library
      [23.8358, 78.7828],
      [23.8368, 78.7842], // Academic Block
      [23.8380, 78.7860],
      [23.8390, 78.7875], // Hostel Block
    ],
  },
  {
    id: "ROUTE_02",
    code: "ROUTE 02",
    name: "Hostel → Canteen → Sports Complex → Main Gate",
    color: "#3B82F6", // Blue accent
    description: "Residential & sports loop connecting dining halls",
    stops: [
      STOPS.HOSTEL_BLOCK,
      STOPS.CANTEEN,
      STOPS.SPORTS_COMPLEX,
      STOPS.MAIN_GATE,
    ],
    waypoints: [
      [23.8390, 78.7875], // Hostel Block
      [23.8382, 78.7850],
      [23.8375, 78.7830], // Canteen
      [23.8355, 78.7845],
      [23.8335, 78.7860], // Sports Complex
      [23.8328, 78.7830],
      [23.8322, 78.7801], // Main Gate
    ],
  },
  {
    id: "ROUTE_03",
    code: "ROUTE 03",
    name: "Main Gate → Administrative Block → Library → Hostel",
    color: "#F59E0B", // Amber accent
    description: "Admin express connecting offices and library",
    stops: [
      STOPS.MAIN_GATE,
      STOPS.ADMIN_BLOCK,
      STOPS.LIBRARY,
      STOPS.HOSTEL_BLOCK,
    ],
    waypoints: [
      [23.8322, 78.7801], // Main Gate
      [23.8338, 78.7825],
      [23.8350, 78.7850], // Admin Block
      [23.8348, 78.7835],
      [23.8345, 78.7818], // Library
      [23.8370, 78.7850],
      [23.8390, 78.7875], // Hostel Block
    ],
  },
];

export const BUSES: BusInfo[] = [
  {
    id: "B-01",
    name: "Campus Shuttle",
    registrationNumber: "MP 15 CB 1001",
    capacity: 45,
    assignedRouteId: "ROUTE_01",
    conductorName: "Rajesh Kumar",
    conductorPhone: "+91 98765 43210",
  },
  {
    id: "B-02",
    name: "Hostel Express",
    registrationNumber: "MP 15 CB 1002",
    capacity: 50,
    assignedRouteId: "ROUTE_02",
    conductorName: "Vikram Singh",
    conductorPhone: "+91 98765 43211",
  },
  {
    id: "B-03",
    name: "Admin Ring",
    registrationNumber: "MP 15 CB 1003",
    capacity: 35,
    assignedRouteId: "ROUTE_03",
    conductorName: "Manoj Sharma",
    conductorPhone: "+91 98765 43212",
  },
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: "SCH_1",
    time: "08:00 AM",
    busId: "B-01",
    busName: "Campus Shuttle",
    routeId: "ROUTE_01",
    routeName: "Main Gate → Hostel",
    status: "COMPLETED",
  },
  {
    id: "SCH_2",
    time: "08:30 AM",
    busId: "B-01",
    busName: "Campus Shuttle",
    routeId: "ROUTE_01",
    routeName: "Hostel → Academic Block",
    status: "ACTIVE",
  },
  {
    id: "SCH_3",
    time: "09:00 AM",
    busId: "B-02",
    busName: "Hostel Express",
    routeId: "ROUTE_02",
    routeName: "Main Gate → Library",
    status: "UPCOMING",
  },
  {
    id: "SCH_4",
    time: "09:30 AM",
    busId: "B-03",
    busName: "Admin Ring",
    routeId: "ROUTE_03",
    routeName: "Main Gate → Admin Block",
    status: "UPCOMING",
  },
  {
    id: "SCH_5",
    time: "10:15 AM",
    busId: "B-01",
    busName: "Campus Shuttle",
    routeId: "ROUTE_01",
    routeName: "Academic Block → Main Gate",
    status: "UPCOMING",
  },
];
