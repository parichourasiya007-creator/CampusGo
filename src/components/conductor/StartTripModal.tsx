import React from 'react';
import { Bus, Navigation, ShieldCheck, MapPin, AlertCircle, X } from 'lucide-react';
import './StartTripModal.css';

interface StartTripModalProps {
  busId: string;
  routeName: string;
  startingPoint: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const StartTripModal: React.FC<StartTripModalProps> = ({
  busId,
  routeName,
  startingPoint,
  onConfirm,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="start-modal-card">
        <div className="modal-header">
          <div className="modal-badge-icon">
            <Navigation size={22} />
          </div>
          <div>
            <h2 className="modal-title">START LIVE TRIP</h2>
            <p className="modal-subtitle">Conductor Location Broadcast Confirmation</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="trip-summary-box">
          <div className="summary-row">
            <span className="summary-label">Assigned Vehicle</span>
            <span className="summary-value highlight">🚌 {busId}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Route</span>
            <span className="summary-value">{routeName}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Starting Point</span>
            <span className="summary-value">
              <MapPin size={14} className="text-live" /> {startingPoint}
            </span>
          </div>
        </div>

        <div className="privacy-notice-box">
          <ShieldCheck size={20} className="notice-icon" />
          <p className="notice-text">
            "Your phone's GPS location will be shared with students while this trip is active."
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-start-tracking" onClick={onConfirm}>
            <Navigation size={18} />
            <span>START LIVE TRACKING</span>
          </button>
        </div>
      </div>
    </div>
  );
};
