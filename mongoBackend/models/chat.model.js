import mongoose from "mongoose";
 

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        sender: { type: String, enum: ["user", "bot"], required: true },

        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    riskAssessment: {
      phq9Score: Number,
      gad7Score: Number,
      riskLevel: { type: String, enum: ["high", "mid", "low"] },
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
