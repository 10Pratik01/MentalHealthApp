// routes/activity.routes.js
import express from "express";
import activitiesModel from "../models/activities.model.js";

const router = express.Router();

// POST /api/v1/activity/add-dummy
router.post("/add-dummy", async (req, res) => {
  try {// pass any valid userId from DB

    const dummyActivities = [
      {     
        type: "video",
        link: "https://www.youtube.com/watch?v=dummy-coding-video",
        mood: "moderate",
      },
      {
        type: "article",
        link: "https://medium.com/dummy-article",
        mood: "mild",
      },
      {
        type: "audio",
        link: "https://spotify.com/dummy-audio",
        mood: "severe",
      },
    ];

    const created = await activitiesModel.insertMany(dummyActivities);

    res.status(201).json({
      success: true,
      message: "Dummy activities added successfully",
      activities: created,
    });
  } catch (error) {
    console.error("Error adding dummy activities:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
