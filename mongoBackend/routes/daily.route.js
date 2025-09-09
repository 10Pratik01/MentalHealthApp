import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createDailyReport, deleteDailyReport, getActivitiesSortedByMood, getDailyReportById, getDailyReports, getDailyReportsWithAggregation, getMoodTrends, getTodaysReports, getWeeklySummary, updateDailyReport } from '../controller/dailyReport.controller.js';

const dailyRouter = Router();

// Apply authentication middleware to all routes
dailyRouter.use(protect);

// Main daily reports routes
dailyRouter.route('/')
  .post(createDailyReport)
  .get(getDailyReports);

// Alternative aggregation-based endpoint
dailyRouter.route('/aggregated')
  .get(getDailyReportsWithAggregation);

// Today's reports
dailyRouter.route('/today')
  .get(getTodaysReports);

// Analytics routes
dailyRouter.route('/analytics/weekly')
  .get(getWeeklySummary);

dailyRouter.route('/analytics/mood-trends')
  .get(getMoodTrends);

// Individual report operations
dailyRouter.route('/:id')
  .get(getDailyReportById)
  .put(updateDailyReport)
  .delete(deleteDailyReport);

// Get activities sorted by mood for a specific report
dailyRouter.route('/:id/activities-sorted')
  .get(getActivitiesSortedByMood);

export default dailyRouter;
