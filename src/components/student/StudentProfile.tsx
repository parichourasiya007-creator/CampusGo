import React from 'react';
import { useBus } from '../../context/BusContext';
import { GraduationCap, ShieldCheck, MapPin, LogOut, Bus } from 'lucide-react';
import './StudentProfile.css';

export const StudentProfile: React.FC = () => {
  const { user, logout } = useBus();

  return (
    <div className="profile-responsive-page">
      <div className="page-header">
        <h2 className="page-title">Student Profile & Credentials</h2>
        <p className="page-subtitle">DHSGSU Sagar Campus Transport Student Portal</p>
      </div>

      {/* Main Student Credential Card */}
      <div className="student-id-card">
        <div className="id-card-top">
          <div className="univ-seal">🚌</div>
          <div>
            <h3 className="id-univ-title">DR. HARISINGH GOUR VISHWAVAIDYALAYA</h3>
            <span className="id-univ-sub">SAGAR, MADHYA PRADESH • ESTD 1946</span>
          </div>
        </div>

        <div className="id-card-body">
          <div className="avatar-box">
            <GraduationCap size={32} />
          </div>

          <div className="student-info-group">
            <h4 className="student-name">{user?.name || 'DHSGSU Student'}</h4>
            <div className="programme-tag">Student Enrolment ID</div>
            <div className="enrol-no">ID: {user?.universityId || 'DHSGSU-2024-1001'}</div>
          </div>
        </div>

        <div className="id-card-footer">
          <div className="footer-item">
            <span className="lbl">Campus</span>
            <span className="val">Patharia Hills Campus</span>
          </div>
          <div className="footer-item">
            <span className="lbl">Status</span>
            <span className="val text-live">Active Student</span>
          </div>
        </div>
      </div>

      {/* Account Preferences */}
      <div className="account-sections-grid">
        <div className="sec-box">
          <h4 className="sec-title">CAMPUS TRANSPORT PREFERENCES</h4>

          <div className="tile-row">
            <MapPin size={18} className="text-live" />
            <div>
              <div className="tile-t">Primary Shuttle Stop</div>
              <div className="tile-s">Gate No. 1 (Main Entrance)</div>
            </div>
          </div>
        </div>

        <div className="sec-box">
          <h4 className="sec-title">ACCOUNT MANAGEMENT</h4>

          <button className="tile-btn-danger" onClick={logout}>
            <LogOut size={18} />
            <span>Sign Out of CampusGo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
