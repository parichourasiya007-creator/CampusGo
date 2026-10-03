import mongoose from 'mongoose';

const LiveLocationSchema = new mongoose.Schema({
  busId: { type: String, required: true, index: true },
  tripId: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude] per GeoJSON standard
      required: true,
    },
  },
  accuracy: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Enable 2dsphere spatial index for high performance distance/geospatial queries
LiveLocationSchema.index({ location: '2dsphere' });

export default mongoose.models.LiveLocation || mongoose.model('LiveLocation', LiveLocationSchema);
