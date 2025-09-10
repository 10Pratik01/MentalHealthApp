import express from "express";

import { protect } from "../middleware/auth.js"; // JWT auth middleware
import { createAppointment, deleteAppointment, getAppointments } from "../controller/schedule.controller.js";

const scheduleRouter = express.Router();

// All routes require authentication
scheduleRouter.use(protect);

scheduleRouter.post("/", createAppointment);       // Create new appointment
scheduleRouter.get("/", getAppointments);         // Get all appointments of current user
scheduleRouter.delete("/:id", deleteAppointment); // Delete specific appointment

// Optional admin route
// router.get("/all", getAllAppointments);

export default scheduleRouter;
