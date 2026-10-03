export interface DHSGSUStop {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  description: string;
}

export interface DHSGSURoute {
  id: string;
  code: string;
  name: string;
  stops: DHSGSUStop[];
  waypoints: [number, number][];
}

export interface DHSGSUBus {
  id: string;
  busNumber: string;
  registrationNumber: string;
  capacity: number;
  assignedRouteId: string;
}

export const DHSGSU_UNIVERSITY_INFO = {
  fullName: "Dr. Harisingh Gour Vishwavidyalaya",
  shortName: "DHSGSU Sagar",
  tag: "A Central University • Estd. 1946",
  locationName: "Patharia Hills, Sagar, Madhya Pradesh - 470003",
  websiteUrl: "https://www.dhsgsu.edu.in",
  campusCenter: {
    lat: 23.8327,
    lng: 78.7816,
  },
  defaultZoom: 16,
};

// Official/configured campus stops at DHSGSU Sagar
export const OFFICIAL_STOPS: Record<string, DHSGSUStop> = {
  GATE_1: {
    id: "GATE_1",
    name: "Gate No. 1 (Main Entrance)",
    code: "G1",
    lat: 23.8315,
    lng: 78.7780,
    description: "Main campus gate connecting to Sagar City Road",
  },
  GOUR_BHAWAN: {
    id: "GOUR_BHAWAN",
    name: "Gour Bhawan / VC Office",
    code: "GB",
    lat: 23.8328,
    lng: 78.7802,
    description: "Administrative headquarters & Founder's Memorial",
  },
  CENTRAL_LIBRARY: {
    id: "CENTRAL_LIBRARY",
    name: "Jawaharlal Nehru Central Library",
    code: "CL",
    lat: 23.8340,
    lng: 78.7820,
    description: "University central library & digital resource wing",
  },
  SCIENCE_BLOCK: {
    id: "SCIENCE_BLOCK",
    name: "School of Applied Sciences",
    code: "SB",
    lat: 23.8355,
    lng: 78.7845,
    description: "Department of Physics, Chemistry & Applied Geology",
  },
  ARTS_COMMERCE_BLOCK: {
    id: "ARTS_COMMERCE_BLOCK",
    name: "Arts & Commerce Complex",
    code: "AC",
    lat: 23.8362,
    lng: 78.7830,
    description: "School of Social Sciences & Management Studies",
  },
  STUDENT_HOSTELS: {
    id: "STUDENT_HOSTELS",
    name: "Tagore & Rani Laxmibai Hostels",
    code: "SH",
    lat: 23.8385,
    lng: 78.7870,
    description: "Boys & Girls residential hostels campus zone",
  },
  HEALTH_CANTEEN: {
    id: "HEALTH_CANTEEN",
    name: "Health Centre & Canteen",
    code: "HC",
    lat: 23.8332,
    lng: 78.7838,
    description: "University health center and central student cafeteria",
  },
};

// Configured campus routes (can be updated via backend API)
export const OFFICIAL_ROUTES: DHSGSURoute[] = [
  {
    id: "ROUTE_DHSGSU_01",
    code: "CAMPUS ROUTE 1",
    name: "Main Gate → Central Library → Science Block → Student Hostels",
    stops: [
      OFFICIAL_STOPS.GATE_1,
      OFFICIAL_STOPS.GOUR_BHAWAN,
      OFFICIAL_STOPS.CENTRAL_LIBRARY,
      OFFICIAL_STOPS.SCIENCE_BLOCK,
      OFFICIAL_STOPS.STUDENT_HOSTELS,
    ],
    waypoints: [
      [23.8315, 78.7780],
      [23.8328, 78.7802],
      [23.8340, 78.7820],
      [23.8355, 78.7845],
      [23.8385, 78.7870],
    ],
  },
  {
    id: "ROUTE_DHSGSU_02",
    code: "CAMPUS ROUTE 2",
    name: "Main Gate → Health Centre → Arts Block → Science Block",
    stops: [
      OFFICIAL_STOPS.GATE_1,
      OFFICIAL_STOPS.HEALTH_CANTEEN,
      OFFICIAL_STOPS.ARTS_COMMERCE_BLOCK,
      OFFICIAL_STOPS.SCIENCE_BLOCK,
    ],
    waypoints: [
      [23.8315, 78.7780],
      [23.8332, 78.7838],
      [23.8362, 78.7830],
      [23.8355, 78.7845],
    ],
  },
];

export const OFFICIAL_BUSES: DHSGSUBus[] = [
  {
    id: "BUS_01",
    busNumber: "BUS 01",
    registrationNumber: "MP 15 UA 0101",
    capacity: 52,
    assignedRouteId: "ROUTE_DHSGSU_01",
  },
  {
    id: "BUS_02",
    busNumber: "BUS 02",
    registrationNumber: "MP 15 UA 0102",
    capacity: 48,
    assignedRouteId: "ROUTE_DHSGSU_02",
  },
];
