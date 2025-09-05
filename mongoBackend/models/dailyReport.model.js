import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['start', 'end'], required: true },
  mood: { type: Number, min: 1, max: 10 },
  sleepHours: Number,
  activities: [String],
  notes: String,
}, {timestamps: true});

export const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

