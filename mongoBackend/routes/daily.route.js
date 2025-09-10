import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createDailyReport,
  deleteDailyReport,
  getActivitiesSortedByMood,
  getDailyReportById,
  getDailyReports,
  getTodaysReports,
  getWeeklySummary,
  updateDailyReport,
} from "../controller/dailyReport.controller.js";

const dailyRouter = Router();
dailyRouter.use(protect);

// Create / fetch all
dailyRouter.route("/daily-reports")
  .post(createDailyReport)
  .get(getDailyReports);

// Today’s reports
dailyRouter.get("/today", getTodaysReports);

// Weekly analytics
dailyRouter.get("/analytics/weekly", getWeeklySummary);

// Report by ID
dailyRouter.route("/:id")
  .get(getDailyReportById)
  .put(updateDailyReport)
  .delete(deleteDailyReport);

// Sorted activities
dailyRouter.get("/:id/activities-sorted", getActivitiesSortedByMood);

export default dailyRouter;
