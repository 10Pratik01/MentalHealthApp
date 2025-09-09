import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['start', 'end'], 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  mood: { 
    type: Number, 
    min: 1, 
    max: 10,
    required: function() {
      return this.type === 'end';
    }
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
    required: function() {
      return this.type === 'start';
    }
  },
  activities: {
    type: [String],
    default: []
  },
  notes: {
    type: String,
    trim: true
  },

}, {timestamps: true});

export const DailyReport = mongoose.model('DailyReport', dailyReportSchema);
