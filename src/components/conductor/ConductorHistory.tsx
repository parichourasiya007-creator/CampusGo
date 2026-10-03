import React from 'react';
import { Clock, CheckCircle2, MapPin, Navigation } from 'lucide-react';
import './ConductorHistory.css';

export const ConductorHistory: React.FC = () => {
  const historyItems = [
    {
      id: 'h1',
      busId: 'B-01',
      routeName: 'Route 01 (Main Gate → Hostel)',
      timeSpan: '08:10 AM → 08:52 AM',
      duration: '42 mins',
      distance: '8.4 km',
      stops: 6,
      status: 'Completed',
    },
    {
      id: 'h2',
      busId: 'B-02',
      routeName: 'Route 02 (Hostel → Canteen → Sports Complex)',
      timeSpan: '10:15 AM → 10:57 AM',
      duration: '42 mins',
      distance: '6.2 km',
      stops: 4,
      status: 'Completed',
    },
  ];

  return (
    <div className="history-page">
      <div className="page-header">
        <h2 className="page-title">Trip Logs & History</h2>
        <p className="page-subtitle">Today's completed broadcast shifts</p>
      </div>

      <div className="history-list">
        {historyItems.map((item) => (
          <div key={item.id} className="history-card">
            <div className="history-card-header">
              <div className="history-bus-badge">{item.busId}</div>
              <div className="history-status">
                <CheckCircle2 size={14} className="text-live" />
                <span>{item.status}</span>
              </div>
            </div>

            <h3 className="history-route-title">{item.routeName}</h3>
            <div className="history-time">{item.timeSpan}</div>

            <div className="history-metrics-row">
              <span className="h-metric">
                <Clock size={12} /> {item.duration}
              </span>
              <span className="h-metric">
                <Navigation size={12} /> {item.distance}
              </span>
              <span className="h-metric">
                <MapPin size={12} /> {item.stops} Stops
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
