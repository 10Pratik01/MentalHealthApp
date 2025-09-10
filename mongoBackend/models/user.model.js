import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  dateOfBirth: { 
    type: Date,
    validate: {
      validator: function(value) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  riskLevel: { 
    type: String, 
    enum: ['none', 'mild', 'moderate', 'moderately severe', 'severe'], 
    default: 'none' 
  },
  mobileNumber: {
    type: String, // Changed from Number to String
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Validates exactly 10 digits
      },
      message: 'Mobile number must be exactly 10 digits'
    },
    required: false
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);
