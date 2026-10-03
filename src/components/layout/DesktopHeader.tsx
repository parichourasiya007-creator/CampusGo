import React from 'react';
import { useBus } from '../../context/BusContext';
import { Map, GitFork, MapPin, Bell, User, ShieldCheck } from 'lucide-react';
import './DesktopHeader.css';

interface DesktopHeaderProps {
  activeTab: 'map' | 'routes' | 'stops' | 'updates';
  onTabChange: (tab: 'map' | 'routes' | 'stops' | 'updates') => void;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ activeTab, onTabChange }) => {
  const { role, user, login } = useBus();

  return (
    <header className="desktop-app-header">
      <div className="d-header-left">
        <div className="d-brand-logo">🚌</div>
        <div>
          <h1 className="d-brand-title">CampusGo</h1>
          <span className="d-brand-sub">Dr. Harisingh Gour Vishwavidyalaya • Sagar Campus Transport</span>
        </div>
      </div>

      <nav className="d-header-nav">
        <button
          className={`d-nav-link ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => onTabChange('map')}
        >
          <Map size={18} />
          <span>Live Map</span>
        </button>

        <button
          className={`d-nav-link ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => onTabChange('routes')}
        >
          <GitFork size={18} />
          <span>Routes</span>
        </button>

        <button
          className={`d-nav-link ${activeTab === 'stops' ? 'active' : ''}`}
          onClick={() => onTabChange('stops')}
        >
          <MapPin size={18} />
          <span>Campus Stops</span>
        </button>

        <button
          className={`d-nav-link ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => onTabChange('updates')}
        >
          <Bell size={18} />
          <span>Updates</span>
        </button>
      </nav>

      <div className="d-header-right">
        <button
          className="btn-conductor-toggle"
          onClick={() => {
            if (role === 'CONDUCTOR') login('DHSGSU-2024-1001', 'STUDENT');
            else login('EMP-DHSGSU-501', 'CONDUCTOR');
          }}
        >
          <ShieldCheck size={16} />
          <span>{role === 'CONDUCTOR' ? 'Student View' : 'Conductor Panel'}</span>
        </button>

        <div className="d-user-pill">
          <User size={16} />
          <span>{user?.name || 'DHSGSU Student'}</span>
        </div>
      </div>
    </header>
  );
};
