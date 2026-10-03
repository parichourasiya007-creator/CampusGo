import mongoose from 'mongoose';

const StopSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String },
});

const RouteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  stops: [StopSchema],
  waypoints: [{ type: [Number] }], // Array of [lat, lng]
}, { timestamps: true });

export default mongoose.models.Route || mongoose.model('Route', RouteSchema);
