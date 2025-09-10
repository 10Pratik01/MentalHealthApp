import express, { Router } from "express";

import { protect } from "../middleware/auth.js"; // JWT auth middleware
import { createAppointment, deleteAppointment, getAppointments } from "../controller/schedule.controller.js";

const scheduleRouter = Router();

// All routes require authentication
scheduleRouter.use(protect);

scheduleRouter.post("/create", createAppointment);       // Create new appointment
scheduleRouter.get("/get", getAppointments);         // Get all appointments of current user
scheduleRouter.delete("/:id", deleteAppointment); // Delete specific appointment

// Optional admin route
// router.get("/all", getAllAppointments);

export {scheduleRouter};
