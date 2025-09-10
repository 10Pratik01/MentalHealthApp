import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["start", "end"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mood: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
  },
  { timestamps: true }
);

export const DailyReport = mongoose.model("DailyReport", dailyReportSchema);
