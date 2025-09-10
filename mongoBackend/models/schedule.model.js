import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // e.g., "10:00 AM"
    sessionType: { type: String, default: "General" }, // optional
    notes: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);

