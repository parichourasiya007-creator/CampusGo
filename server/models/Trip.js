import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  busId: { type: String, required: true },
  operatorId: { type: String, required: true },
  routeId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'ENDED'], default: 'ACTIVE' },
}, { timestamps: true });

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
