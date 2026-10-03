import React from 'react';
import { PARISAR_EVENTS } from '../../config/parisarData';
import { DHSGSU_UNIVERSITY_INFO } from '../../config/dhsguData';
import { useBus } from '../../context/BusContext';
import { Calendar, MapPin, ArrowRight, Bus, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import './StudentHome.css';

interface StudentHomeProps {
  onNavigateTab: (tab: 'events' | 'pass' | 'map') => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigateTab }) => {
  const { activeBuses } = useBus();

  return (
    <div className="parisar-home-page">
      {/* DHSGSU University Hero Banner */}
      <section className="univ-hero-banner">
        <div className="hero-content">
          <span className="hero-tag">DR. HARISINGH GOUR VISHWAVIDYALAYA</span>
          <h1 className="hero-title">PARISAR Portal</h1>
          <p className="hero-sub">
            Centralized Campus Events, Student Entry Passes & Live Transport Tracking • Sagar, MP
          </p>
          <div className="hero-actions-row">
            <button className="btn-hero-primary" onClick={() => onNavigateTab('events')}>
              <Calendar size={16} />
              <span>Explore Campus Events</span>
            </button>
            <button className="btn-hero-secondary" onClick={() => onNavigateTab('pass')}>
              <Award size={16} />
              <span>View My Pass</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick University Notice Strip */}
      <div className="notice-strip">
        <Sparkles size={18} className="text-warning" />
        <div className="notice-text">
          <strong>78th Foundation Day & Convocation 2026:</strong> Digital entry pass generation is now active for graduating students.
        </div>
      </div>

      {/* Featured Events Section */}
      <section className="home-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Upcoming DHSGSU Events</h2>
            <p className="section-sub">Official academic ceremonies, symposia & cultural festivals</p>
          </div>
          <button className="see-all-link" onClick={() => onNavigateTab('events')}>
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="events-responsive-grid">
          {PARISAR_EVENTS.map((event) => (
            <div key={event.id} className="home-event-card">
              <div className="event-card-img-wrapper">
                <img src={event.imageUrl} alt={event.title} className="event-card-img" />
                <span className="category-badge">{event.category}</span>
              </div>

              <div className="event-card-body">
                <div className="event-date-row">
                  <Calendar size={14} className="text-live" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-venue-row">
                  <MapPin size={14} className="text-muted" />
                  <span>{event.venue}</span>
                </div>

                <div className="event-card-footer">
                  <span className="status-chip registered">
                    <CheckCircle2 size={12} /> {event.registrationStatus}
                  </span>
                  <button className="btn-event-action" onClick={() => onNavigateTab('events')}>
                    <span>Details →</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Campus Shuttle Status Strip */}
      <section className="shuttle-status-widget">
        <div className="shuttle-widget-inner">
          <div className="shuttle-info-col">
            <div className="shuttle-badge">
              <Bus size={20} />
            </div>
            <div>
              <h3 className="shuttle-title">Live Campus Shuttle Transport</h3>
              <p className="shuttle-desc">
                {activeBuses.length > 0
                  ? `${activeBuses.length} Campus Shuttle ${activeBuses.length === 1 ? 'Bus' : 'Buses'} Broadcasting Real Device GPS`
                  : 'No buses are currently active. Check back during shuttle operating hours.'}
              </p>
            </div>
          </div>

          <button className="btn-track-shuttles" onClick={() => onNavigateTab('map')}>
            <span>Open Campus Map</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
