import { DailyReport } from "../models/dailyReport.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createDailyReport = asyncHandler(async (req, res) => {
  const { type, mood, sleepHours, activities, notes } = req.body;

  // Validate required fields based on type
  if (!type) {
    res.status(400);
    throw new Error("Report type is required");
  }

  if (type === 'start' && !sleepHours && sleepHours !== 0) {
    res.status(400);
    throw new Error("Sleep hours are required for morning reports");
  }

  if (type === 'end' && !mood) {
    res.status(400);
    throw new Error("Mood rating is required for evening reports");
  }

  // Check if user already has a report of this type for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingReport = await DailyReport.findOne({
    userId: req.user.id,
    type: type,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (existingReport) {
    res.status(400);
    throw new Error(`You have already submitted a ${type} report for today`);
  }

  const dailyReport = await DailyReport.create({
    userId: req.user.id,
    type,
    mood: type === 'end' ? mood : undefined,
    sleepHours: type === 'start' ? sleepHours : undefined,
    activities: activities || [],
    notes: notes || ''
  });

  await dailyReport.populate('userId', 'name email riskLevel');

  res.status(201).json({
    success: true,
    message: `${type.charAt(0).toUpperCase() + type.slice(1)} report created successfully`,
    report: dailyReport
  });
});

// @desc    Get all daily reports for the authenticated user
// @route   GET /api/daily-reports
// @access  Private
export const getDailyReports = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    type, 
    startDate, 
    endDate,
    sortBy = 'date',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { userId: req.user.id };
  
  if (type) {
    query.type = type;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const reports = await DailyReport.find(query)
    .populate('userId', 'name email')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalReports = await DailyReport.countDocuments(query);

  res.status(200).json({
    success: true,
    reports,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReports / limit),
      totalReports,
      hasNextPage: page * limit < totalReports,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get today's reports for the authenticated user
// @route   GET /api/daily-reports/today
// @access  Private
export const getTodaysReports = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reports = await DailyReport.find({
    userId: req.user.id,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate('userId', 'name email').sort({ createdAt: 1 });

  const reportStatus = {
    morning: reports.find(r => r.type === 'start') || null,
    evening: reports.find(r => r.type === 'end') || null,
    hasCompletedBoth: reports.length === 2
  };

  res.status(200).json({
    success: true,
    reports,
    reportStatus
  });
});

// @desc    Get a specific daily report by ID
// @route   GET /api/daily-reports/:id
// @access  Private
export const getDailyReportById = asyncHandler(async (req, res) => {
  const report = await DailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('userId', 'name email riskLevel');

  if (!report) {
    res.status(404);
    throw new Error("Daily report not found");
  }

  res.status(200).json({
    success: true,
    report
  });
});

// @desc    Update a daily report
// @route   PUT /api/daily-reports/:id
// @access  Private
export const updateDailyReport = asyncHandler(async (req, res) => {
  const { mood, sleepHours, activities, notes } = req.body;

  const report = await DailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!report) {
    res.status(404);
    throw new Error("Daily report not found");
  }

  // Check if report is from today (prevent editing old reports)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reportDate = new Date(report.date);
  reportDate.setHours(0, 0, 0, 0);

  if (reportDate.getTime() !== today.getTime()) {
    res.status(400);
    throw new Error("You can only edit today's reports");
  }

  // Update fields based on report type
  if (report.type === 'start' && sleepHours !== undefined) {
    report.sleepHours = sleepHours;
  }

  if (report.type === 'end' && mood !== undefined) {
    report.mood = mood;
  }

  if (activities !== undefined) {
    report.activities = activities;
  }

  if (notes !== undefined) {
    report.notes = notes;
  }

  const updatedReport = await report.save();
  await updatedReport.populate('userId', 'name email');

  res.status(200).json({
    success: true,
    message: "Daily report updated successfully",
    report: updatedReport
  });
});

// @desc    Delete a daily report
// @route   DELETE /api/daily-reports/:id
// @access  Private
export const deleteDailyReport = asyncHandler(async (req, res) => {
  const report = await DailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!report) {
    res.status(404);
    throw new Error("Daily report not found");
  }

  // Check if report is from today (prevent deleting old reports)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reportDate = new Date(report.date);
  reportDate.setHours(0, 0, 0, 0);

  if (reportDate.getTime() !== today.getTime()) {
    res.status(400);
    throw new Error("You can only delete today's reports");
  }

  await DailyReport.deleteOne({ _id: report._id });

  res.status(200).json({
    success: true,
    message: "Daily report deleted successfully"
  });
});

// @desc    Get weekly summary of daily reports
// @route   GET /api/daily-reports/analytics/weekly
// @access  Private
export const getWeeklySummary = asyncHandler(async (req, res) => {
  const { weekOffset = 0 } = req.query;

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() - (weekOffset * 7)));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const reports = await DailyReport.find({
    userId: req.user.id,
    date: {
      $gte: startOfWeek,
      $lt: endOfWeek
    }
  }).sort({ date: 1 });

  // Calculate analytics
  const morningReports = reports.filter(r => r.type === 'start');
  const eveningReports = reports.filter(r => r.type === 'end');

  const avgSleepHours = morningReports.length > 0 
    ? morningReports.reduce((sum, r) => sum + r.sleepHours, 0) / morningReports.length 
    : 0;

  const avgMood = eveningReports.length > 0 
    ? eveningReports.reduce((sum, r) => sum + r.mood, 0) / eveningReports.length 
    : 0;

  // Most common activities
  const allActivities = reports.flatMap(r => r.activities);
  const activityCounts = {};
  allActivities.forEach(activity => {
    activityCounts[activity] = (activityCounts[activity] || 0) + 1;
  });

  const topActivities = Object.entries(activityCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));

  // Daily breakdown
  const dailyBreakdown = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const dayReports = reports.filter(r => {
      const reportDate = new Date(r.date);
      reportDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return reportDate.getTime() === date.getTime();
    });

    const morningReport = dayReports.find(r => r.type === 'start');
    const eveningReport = dayReports.find(r => r.type === 'end');

    dailyBreakdown.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
      morningCompleted: !!morningReport,
      eveningCompleted: !!eveningReport,
      sleepHours: morningReport?.sleepHours || null,
      mood: eveningReport?.mood || null,
      activities: dayReports.flatMap(r => r.activities)
    });
  }

  res.status(200).json({
    success: true,
    summary: {
      weekPeriod: {
        start: startOfWeek.toISOString().split('T')[0],
        end: new Date(endOfWeek.getTime() - 1).toISOString().split('T')[0]
      },
      statistics: {
        totalReports: reports.length,
        morningReports: morningReports.length,
        eveningReports: eveningReports.length,
        completionRate: Math.round((reports.length / 14) * 100), // 14 = 7 days * 2 reports per day
        avgSleepHours: Math.round(avgSleepHours * 10) / 10,
        avgMood: Math.round(avgMood * 10) / 10
      },
      topActivities,
      dailyBreakdown
    }
  });
});

// @desc    Get mood trends over time
// @route   GET /api/daily-reports/analytics/mood-trends
// @access  Private
export const getMoodTrends = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const reports = await DailyReport.find({
    userId: req.user.id,
    type: 'end',
    mood: { $exists: true },
    date: { $gte: startDate }
  }).sort({ date: 1 });

  const moodTrends = reports.map(report => ({
    date: report.date.toISOString().split('T')[0],
    mood: report.mood,
    activities: report.activities,
    notes: report.notes
  }));

  // Calculate trend analysis
  const moods = reports.map(r => r.mood);
  const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  
  let trend = 'stable';
  if (moods.length >= 7) {
    const firstWeekAvg = moods.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
    const lastWeekAvg = moods.slice(-7).reduce((a, b) => a + b, 0) / 7;
    
    if (lastWeekAvg > firstWeekAvg + 0.5) trend = 'improving';
    else if (lastWeekAvg < firstWeekAvg - 0.5) trend = 'declining';
  }

  res.status(200).json({
    success: true,
    moodTrends,
    analytics: {
      avgMood: Math.round(avgMood * 10) / 10,
      totalEntries: reports.length,
      trend,
      periodDays: parseInt(days)
    }
  });
});
