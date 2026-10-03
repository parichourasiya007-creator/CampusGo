import React from 'react';
import { useBus } from '../../context/BusContext';
import { Clock, Calendar, CheckCircle2, PlayCircle, AlertCircle } from 'lucide-react';
import './StudentSchedule.css';

export const StudentSchedule: React.FC = () => {
  const { schedule } = useBus();

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div className="header-date-badge">
          <Calendar size={14} />
          <span>TODAY'S TIMETABLE</span>
        </div>
        <h2 className="page-title">Shuttle Schedule</h2>
        <p className="page-subtitle">Real-time daily dispatch timeline • DHSGV Campus</p>
      </div>

      <div className="schedule-timeline">
        {schedule.map((item) => {
          return (
            <div key={item.id} className={`schedule-item ${item.status.toLowerCase()}`}>
              <div className="time-col">
                <span className="schedule-time">{item.time}</span>
                <span className={`schedule-status-tag ${item.status.toLowerCase()}`}>
                  {item.status === 'ACTIVE' && <PlayCircle size={12} />}
                  {item.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                  {item.status === 'UPCOMING' && <Clock size={12} />}
                  {item.status}
                </span>
              </div>

              <div className="timeline-connector">
                <div className="connector-dot" />
                <div className="connector-line" />
              </div>

              <div className="schedule-card">
                <div className="schedule-bus-row">
                  <span className="schedule-bus-name">{item.busName} ({item.busId})</span>
                </div>
                <div className="schedule-route-name">{item.routeName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
