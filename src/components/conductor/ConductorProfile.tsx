import React from 'react';
import { useBus } from '../../context/BusContext';
import { ShieldCheck, Smartphone, Navigation, Radio, LogOut, CheckCircle2 } from 'lucide-react';
import './ConductorProfile.css';

export const ConductorProfile: React.FC = () => {
  const { user, logout } = useBus();

  return (
    <div className="conductor-profile-page">
      <div className="page-header">
        <h2 className="page-title">Operator Profile & Hardware</h2>
        <p className="page-subtitle">Broadcaster device configuration • DHSGV Sagar</p>
      </div>

      <div className="op-card">
        <div className="op-avatar">
          <ShieldCheck size={28} />
        </div>
        <div className="op-info">
          <h3 className="op-name">{user?.name || 'Rajesh Kumar'}</h3>
          <div className="op-id">Conductor ID: {user?.conductorId || 'CND-809'}</div>
          <div className="op-emp">Employee: EMP-DHSGV-402</div>
        </div>
      </div>

      <div className="op-section">
        <h4 className="op-section-title">HARDWARE & PERMISSIONS</h4>

        <div className="op-tile">
          <Smartphone size={18} className="text-live" />
          <div className="op-tile-content">
            <div className="op-tile-title">Phone GPS Permission</div>
            <div className="op-tile-desc">High Precision Location Services Enabled</div>
          </div>
          <CheckCircle2 size={18} className="text-live" />
        </div>

        <div className="op-tile">
          <Navigation size={18} className="text-live" />
          <div className="op-tile-content">
            <div className="op-tile-title">Location Sharing</div>
            <div className="op-tile-desc">Active during live trip broadcasting</div>
          </div>
          <CheckCircle2 size={18} className="text-live" />
        </div>

        <div className="op-tile">
          <Radio size={18} className="text-live" />
          <div className="op-tile-content">
            <div className="op-tile-title">Background Telemetry</div>
            <div className="op-tile-desc">Keep active when screen locked</div>
          </div>
          <CheckCircle2 size={18} className="text-live" />
        </div>
      </div>

      <div className="op-section">
        <button className="op-logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>SIGN OUT OF OPERATOR CONSOLE</span>
        </button>
      </div>
    </div>
  );
};
