import React, { useState } from 'react';
import { useBus } from '../context/BusContext';
import { Bus, GraduationCap, ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';
import './AuthScreen.css';

export const AuthScreen: React.FC = () => {
  const { login } = useBus();
  const [email, setEmail] = useState('student@campusgo.demo');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'CONDUCTOR'>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  const selectDemo = (role: 'STUDENT' | 'CONDUCTOR', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    login(demoEmail, role);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo-badge">
            <Bus size={28} className="auth-logo-icon" />
            <div className="auth-logo-pulse" />
          </div>
          <h1 className="auth-title">CampusGo</h1>
          <p className="auth-tagline">"Know your bus. Know your arrival."</p>
          <div className="auth-univ-tag">Dr. Harisingh Gour Vishwavidyalaya</div>
        </div>

        {/* Role Toggle Selector */}
        <div className="role-selector-pills">
          <button
            type="button"
            className={`role-pill ${selectedRole === 'STUDENT' ? 'active' : ''}`}
            onClick={() => {
              setSelectedRole('STUDENT');
              setEmail('student@campusgo.demo');
            }}
          >
            <GraduationCap size={16} />
            <span>Student</span>
          </button>

          <button
            type="button"
            className={`role-pill ${selectedRole === 'CONDUCTOR' ? 'active' : ''}`}
            onClick={() => {
              setSelectedRole('CONDUCTOR');
              setEmail('conductor@campusgo.demo');
            }}
          >
            <ShieldCheck size={16} />
            <span>Conductor Operator</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="univ-id">University ID / Portal Email</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="univ-id"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter University ID"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">
            <span>Sign In to {selectedRole === 'CONDUCTOR' ? 'Operator Console' : 'CampusGo'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="demo-quick-section">
          <div className="demo-divider">
            <span>Quick Demo Accounts</span>
          </div>

          <div className="demo-cards-grid">
            <button
              type="button"
              className="demo-card student-demo"
              onClick={() => selectDemo('STUDENT', 'student@campusgo.demo')}
            >
              <div className="demo-card-icon">
                <GraduationCap size={20} />
              </div>
              <div className="demo-card-info">
                <div className="demo-card-role">Student Account</div>
                <div className="demo-card-email">student@campusgo.demo</div>
                <div className="demo-card-action">Track Campus Buses →</div>
              </div>
            </button>

            <button
              type="button"
              className="demo-card conductor-demo"
              onClick={() => selectDemo('CONDUCTOR', 'conductor@campusgo.demo')}
            >
              <div className="demo-card-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="demo-card-info">
                <div className="demo-card-role">Conductor Operator</div>
                <div className="demo-card-email">conductor@campusgo.demo</div>
                <div className="demo-card-action">Broadcast GPS & Control →</div>
              </div>
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <span>Protected Single-Application Mobility Platform • DHSGV Sagar</span>
        </div>
      </div>
    </div>
  );
};
