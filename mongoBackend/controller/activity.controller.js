import activitiesModel from "../models/activities.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addActivity = asyncHandler(async (req, res) => {
  const { type, link, mood } = req.body;

  if (!type || !link || !mood) {
    res.status(400);
    throw new Error("All fields (type, link, mood) are required");
  }

  // Optional: Validate 'type' and 'mood' values against enum constraints
  const validTypes = ["video", "article", "audio", "other"];
  const validMoods = ["none", "mild", "moderate", "severely moderate", "severe"];

  if (!validTypes.includes(type)) {
    res.status(400);
    throw new Error(`Invalid type. Allowed values: ${validTypes.join(", ")}`);
  }

  if (!validMoods.includes(mood)) {
    res.status(400);
    throw new Error(`Invalid mood. Allowed values: ${validMoods.join(", ")}`);
  }

  // Optional: Check if an activity with the same link already exists to prevent duplicates
  const existingActivity = await activitiesModel.findOne({ link: link });
  if (existingActivity) {
    res.status(409); // Conflict
    throw new Error("An activity with this link already exists");
  }

  // Create new activity
  const newActivity = await activitiesModel.create({
    type,
    link,
    mood
  });

  res.status(201).json({
    success: true,
    message: "Activity successfully added",
    activity: newActivity
  });
});
