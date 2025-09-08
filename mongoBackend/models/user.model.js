import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  riskLevel: { type: String, enum: ['high', 'mid', 'low'], default: 'low' },
}, {timestamps: true});


export const User = mongoose.model('User', userSchema);