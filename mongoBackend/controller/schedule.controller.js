import Schedule from "../models/schedule.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Create Appointment
export const createAppointment = asyncHandler(async (req, res) => {
  const { date, time, sessionType, notes } = req.body;

  if (!date || !time) {
    res.status(400);
    throw new Error("Date and time are required");
  }

  // Check if slot already booked for this user
  const existing = await Schedule.findOne({ user: req.user._id, date, time });
  if (existing) {
    res.status(400);
    throw new Error("You already booked this slot");
  }

  const appointment = await Schedule.create({
    user: req.user._id,
    date,
    time,
    sessionType,
    notes,
  });

  res.status(201).json({ success: true, message: "Appointment booked", appointment });
});

// ✅ Get Appointments for current user
export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Schedule.find({ user: req.user._id })
    .sort({ date: 1, time: 1 })
    .populate("user", "name email"); // include user info if needed
  res.status(200).json(appointments);
});

// ✅ Delete Appointment
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Schedule.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (String(appointment.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await appointment.deleteOne();
  res.status(200).json({ success: true, message: "Appointment deleted" });
});

// ✅ Optional: Admin - get all appointments
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Schedule.find()
    .sort({ date: 1, time: 1 })
    .populate("user", "name email");
  res.status(200).json(appointments);
});
