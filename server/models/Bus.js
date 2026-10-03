import mongoose from 'mongoose';

const BusSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  busNumber: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  capacity: { type: Number, default: 50 },
  assignedRouteId: { type: String, required: true },
  status: { type: String, enum: ['INACTIVE', 'ACTIVE'], default: 'INACTIVE' },
  currentTripId: { type: String },
}, { timestamps: true });

export default mongoose.models.Bus || mongoose.model('Bus', BusSchema);
