import React, { useEffect } from 'react';
import { useBus } from '../../context/BusContext';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import './StudentNotifications.css';

export const StudentNotifications: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useBus();

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  return (
    <div className="notifications-page">
      <div className="page-header flex-between">
        <div>
          <h2 className="page-title">Live Transport Updates</h2>
          <p className="page-subtitle">Real-time transit alerts & conductor broadcasts</p>
        </div>
        <button className="mark-read-btn" onClick={markNotificationsAsRead}>
          <Check size={14} />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={32} className="empty-icon" />
            <p>No new transport alerts right now.</p>
          </div>
        ) : (
          notifications.map((note) => {
            return (
              <div key={note.id} className={`notification-card ${note.type}`}>
                <div className="note-icon-col">
                  {note.type === 'success' && <CheckCircle2 className="icon-success" size={20} />}
                  {note.type === 'warning' && <AlertTriangle className="icon-warning" size={20} />}
                  {note.type === 'danger' && <AlertCircle className="icon-danger" size={20} />}
                  {note.type === 'info' && <Info className="icon-info" size={20} />}
                </div>

                <div className="note-content">
                  <div className="note-header">
                    <span className="note-title">{note.title}</span>
                    <span className="note-time">{note.timestamp}</span>
                  </div>
                  <p className="note-message">{note.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
