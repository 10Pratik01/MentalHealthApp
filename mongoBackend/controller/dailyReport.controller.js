import { DailyReport } from "../models/dailyReport.model.js";
import activitiesModel from "../models/activities.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const MOOD_PRIORITY = {
  none: 0,
  mild: 1,
  moderate: 2,
  "severely moderate": 3,
  severe: 4,
};

const sortActivitiesByMood = (activities, order = "desc") => {
  return activities.sort((a, b) => {
    const aPriority = MOOD_PRIORITY[a.mood] ?? -1;
    const bPriority = MOOD_PRIORITY[b.mood] ?? -1;
    return order === "desc" ? bPriority - aPriority : aPriority - bPriority;
  });
};

// ✅ Create Daily Report
export const createDailyReport = asyncHandler(async (req, res) => {
  const { type, mood, activities, notes, name } = req.body;

  if (!type || !name || mood === undefined || mood === null) {
    res.status(400);
    throw new Error("Type, name and mood are required");
  }

  // prevent duplicate same-day same-type report
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingReport = await DailyReport.findOne({
    user: req.user._id,
    type,
    date: { $gte: today, $lt: tomorrow },
  });

  if (existingReport) {
    res.status(400);
    throw new Error(`You already submitted a ${type} report today`);
  }

  let validActivities = [];
  if (activities?.length > 0) {
    validActivities = await activitiesModel.find({ _id: { $in: activities } });
    if (validActivities.length !== activities.length) {
      res.status(400);
      throw new Error("Invalid activities provided");
    }
  }

  const report = await DailyReport.create({
    user: req.user._id,
    name: name.trim(),
    type,
    mood,
    activities: activities || [],
    notes: notes || "",
  });

  await report.populate("activities");
  if (report.activities.length > 0) {
    report.activities = sortActivitiesByMood(report.activities);
  }
  await report.populate("user", "name email riskLevel");

  res.status(201).json({ success: true, message: "Report created", report });
});

// ✅ Get All Reports
export const getDailyReports = asyncHandler(async (req, res) => {
  const reports = await DailyReport.find({ user: req.user._id })
    .populate("activities")
    .sort({ date: -1 });
  res.status(200).json(reports);
});

// ✅ Get Today’s Reports
export const getTodaysReports = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reports = await DailyReport.find({
    user: req.user._id,
    date: { $gte: today, $lt: tomorrow },
  }).populate("activities");

  res.status(200).json(reports);
});

// ✅ Get Reports By ID
export const getDailyReportById = asyncHandler(async (req, res) => {
  const report = await DailyReport.findById(req.params.id).populate("activities");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  res.status(200).json(report);
});

// ✅ Update Report
export const updateDailyReport = asyncHandler(async (req, res) => {
  const report = await DailyReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  if (String(report.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  Object.assign(report, req.body);
  await report.save();
  res.status(200).json({ success: true, message: "Report updated", report });
});

// ✅ Delete Report
export const deleteDailyReport = asyncHandler(async (req, res) => {
  const report = await DailyReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  if (String(report.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await report.deleteOne();
  res.status(200).json({ success: true, message: "Report deleted" });
});

// ✅ Get Activities Sorted by Mood
export const getActivitiesSortedByMood = asyncHandler(async (req, res) => {
  const report = await DailyReport.findById(req.params.id).populate("activities");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const sortedActivities = sortActivitiesByMood(report.activities);
  res.status(200).json(sortedActivities);
});

// ✅ Get Weekly Summary
export const getWeeklySummary = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const reports = await DailyReport.find({
    user: req.user._id,
    date: { $gte: lastWeek, $lte: today },
  });

  if (!reports.length) {
    return res.status(200).json({ message: "No reports in the last 7 days" });
  }

  const avgMood = reports.reduce((acc, r) => acc + r.mood, 0) / reports.length;

  res.status(200).json({
    totalReports: reports.length,
    averageMood: avgMood.toFixed(2),
    reports,
  });
});
