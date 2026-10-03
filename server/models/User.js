import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  universityId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'OPERATOR'], required: true },
  phone: { type: String },
  passwordHash: { type: String },
  assignedBusId: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
