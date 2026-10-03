import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { OFFICIAL_BUSES, OFFICIAL_ROUTES, OFFICIAL_STOPS, DHSGSU_UNIVERSITY_INFO } from '../config/dhsguData';

export type UserRole = 'STUDENT' | 'CONDUCTOR' | null;

export interface RealBusState {
  busId: string;
  routeId: string;
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  timestamp: number;
  lastUpdated: string;
}

export interface DHSGSUNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  timestamp: string;
  busId?: string;
}

interface BusContextType {
  role: UserRole;
  user: any | null;
  activeBuses: RealBusState[];
  selectedBusId: string | null;
  notifications: DHSGSUNotification[];
  socket: Socket | null;
  isConnected: boolean;

  login: (universityId: string, role: 'STUDENT' | 'CONDUCTOR') => void;
  logout: () => void;
  setSelectedBusId: (busId: string | null) => void;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [user, setUser] = useState<any | null>({
    id: 'STD_01',
    universityId: 'DHSGSU-2024-1001',
    role: 'STUDENT',
    name: 'DHSGSU Student',
  });

  const [activeBuses, setActiveBuses] = useState<RealBusState[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<DHSGSUNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize Socket.IO connection
  useEffect(() => {
    const s = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    s.on('connect', () => {
      console.log('[Socket.IO Client] Connected to CampusGo Backend');
      setIsConnected(true);
      s.emit('student:subscribe');
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    // Real-time Bus Location Changed Event from Backend
    s.on('student:bus-location-changed', (data: RealBusState) => {
      setActiveBuses((prev) => {
        const existingIdx = prev.findIndex((b) => b.busId === data.busId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = data;
          return updated;
        } else {
          return [...prev, data];
        }
      });
    });

    // Trip Started
    s.on('student:trip-started', (data: { busId: string; routeId: string }) => {
      // Refresh active list or wait for position ping
    });

    // Trip Ended -> Instantly remove active bus from map layer
    s.on('student:trip-ended', (data: { busId: string }) => {
      setActiveBuses((prev) => prev.filter((b) => b.busId !== data.busId));
      setSelectedBusId((curr) => (curr === data.busId ? null : curr));
    });

    // Notifications Stream
    s.on('student:notification', (note: DHSGSUNotification) => {
      setNotifications((prev) => [note, ...prev]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const login = (universityId: string, selectedRole: 'STUDENT' | 'CONDUCTOR') => {
    setRole(selectedRole);
    if (selectedRole === 'CONDUCTOR') {
      setUser({
        id: 'COND_01',
        universityId: universityId || 'EMP-DHSGSU-501',
        role: 'CONDUCTOR',
        assignedBusId: 'BUS_01',
        name: 'Authorized Conductor',
      });
    } else {
      setUser({
        id: 'STD_01',
        universityId: universityId || 'DHSGSU-2024-1001',
        role: 'STUDENT',
        name: 'DHSGSU Student',
      });
    }
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <BusContext.Provider
      value={{
        role,
        user,
        activeBuses,
        selectedBusId,
        notifications,
        socket,
        isConnected,
        login,
        logout,
        setSelectedBusId,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBus = () => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};
