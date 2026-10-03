import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { Play, SkipForward, AlertTriangle, AlertOctagon, X, Clock, Send } from 'lucide-react';
import './TripControls.css';

interface TripControlsProps {
  busId: string;
}

export const TripControls: React.FC<TripControlsProps> = ({ busId }) => {
  const { advanceStop, skipStop, reportDelay } = useBus();
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Traffic congestion');
  const [delayMinutes, setDelayMinutes] = useState(5);

  const delayOptions = [
    'Traffic congestion',
    'Vehicle issue / maintenance',
    'Route obstruction',
    'Heavy student boarding',
    'Other',
  ];

  const handleSendDelay = () => {
    reportDelay(busId, selectedReason, delayMinutes);
    setShowDelayModal(false);
  };

  return (
    <div className="trip-controls-container">
      <div className="controls-label-bar">
        <span>Operational Controls</span>
        <span className="live-pill">GPS Broadcast Active</span>
      </div>

      <div className="controls-grid">
        <button className="control-btn advance" onClick={() => advanceStop(busId)}>
          <Play size={18} />
          <span>Arrived at Next Stop</span>
        </button>

        <button className="control-btn skip" onClick={() => skipStop(busId)}>
          <SkipForward size={18} />
          <span>Skip Stop</span>
        </button>

        <button className="control-btn delay" onClick={() => setShowDelayModal(true)}>
          <AlertTriangle size={18} />
          <span>Report Delay</span>
        </button>

        <button
          className="control-btn emergency"
          onClick={() => {
            if (window.confirm('Send emergency alert to Campus Transport Dispatch?')) {
              reportDelay(busId, 'EMERGENCY: Vehicle Breakdown', 15);
            }
          }}
        >
          <AlertOctagon size={18} />
          <span>Emergency</span>
        </button>
      </div>

      {/* Report Delay Modal */}
      {showDelayModal && (
        <div className="modal-overlay">
          <div className="delay-modal-card">
            <div className="modal-header">
              <div className="modal-badge-warning">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="modal-title">REPORT TRIP DELAY</h3>
                <p className="modal-subtitle">Broadcast delay notification to students</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowDelayModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="field-label">Delay Reason</label>
              <div className="reasons-list">
                {delayOptions.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`reason-chip ${selectedReason === reason ? 'active' : ''}`}
                    onClick={() => setSelectedReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Estimated Delay Duration</label>
              <div className="duration-selector">
                {[3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    className={`dur-chip ${delayMinutes === mins ? 'active' : ''}`}
                    onClick={() => setDelayMinutes(mins)}
                  >
                    <Clock size={14} />
                    <span>+{mins} min</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDelayModal(false)}>
                Cancel
              </button>
              <button className="btn-send-delay" onClick={handleSendDelay}>
                <Send size={16} />
                <span>Publish Delay Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
