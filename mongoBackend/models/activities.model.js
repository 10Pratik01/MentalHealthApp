// models/dashboard/Activity.model.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "article", "audio", "other"],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      enum: ["none", "mild", "moderate", "severely moderate", "severe"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
