import { dailyReport } from '../models/dailyReport.model.js';
import activitiesModel from '../models/activities.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Mood priority mapping for sorting activities
const MOOD_PRIORITY = {
  "none": 0,
  "mild": 1,
  "moderate": 2,
  "severely moderate": 3,
  "severe": 4,
};

// Helper function to sort activities based on mood priority
const sortActivitiesByMood = (activities, order = 'desc') => {
  return activities.sort((a, b) => {
    const aPriority = MOOD_PRIORITY[a.mood] ?? -1;
    const bPriority = MOOD_PRIORITY[b.mood] ?? -1;
    return order === 'desc' ? bPriority - aPriority : aPriority - bPriority;
  });
};

// Create new Daily Report
export const createDailyReport = asyncHandler(async (req, res) => {
  const { type, mood, sleepHours, activities, notes, name } = req.body;

  if (!type) {
    res.status(400);
    throw new Error("Report type is required");
  }
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  if (type === 'start' && (sleepHours === undefined || sleepHours === null)) {
    res.status(400);
    throw new Error("Sleep hours required for morning reports");
  }
  if (type === 'end' && (mood === undefined || mood === null)) {
    res.status(400);
    throw new Error("Mood rating required for evening reports");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingReport = await DailyReport.findOne({
    userId: req.user.id,
    type,
    date: { $gte: today, $lt: tomorrow },
  });

  if (existingReport) {
    res.status(400);
    throw new Error(`You have already submitted a ${type} report today`);
  }

  if (activities && activities.length > 0) {
    const validActivities = await activitiesModel.find({ _id: { $in: activities } });
    if (validActivities.length !== activities.length) {
      res.status(400);
      throw new Error("Invalid activities provided");
    }
  }

  const dailyReport = await dailyReport.create({
    userId: req.user.id,
    name: name.trim(),
    type,
    mood: type === 'end' ? mood : undefined,
    sleepHours: type === 'start' ? sleepHours : undefined,
    activities: activities || [],
    notes: notes || '',
  });

  await dailyReport.populate('activities');

  if(dailyReport.activities.length > 0) {
    dailyReport.activities = sortActivitiesByMood(dailyReport.activities);
  }

  await dailyReport.populate('userId', 'name email riskLevel');

  res.status(201).json({
    success: true,
    message: `${type.charAt(0).toUpperCase() + type.slice(1)} report created successfully`,
    report: dailyReport,
  });
});

// Get all Daily Reports (with pagination, filtering, and sorted activities)
export const getDailyReports = asyncHandler(async (req, res) => {
  const { page=1, limit=10, type, startDate, endDate, sortBy='date', sortOrder='desc', activitiesMoodSort='desc' } = req.query;

  const query = { userId: req.user.id };
  if(type) query.type = type;
  if(startDate || endDate) {
    query.date = {};
    if(startDate) query.date.$gte = new Date(startDate);
    if(endDate) query.date.$lte = new Date(endDate);
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const reports = await dailyReport.find(query)
    .populate('userId', 'name email')
    .populate('activities')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  reports.forEach(report => {
    if(report.activities.length > 0){
      report.activities = sortActivitiesByMood(report.activities, activitiesMoodSort);
    }
  });

  const totalReports = await dailyReport.countDocuments(query);

  res.status(200).json({
    success: true,
    reports,
    pagination: {
      currentPage: parseInt(page),
      totalReports,
      totalPages: Math.ceil(totalReports / limit),
      hasNextPage: page * limit < totalReports,
      hasPrevPage: page > 1,
    }
  });
});

// Get Today's reports with sorted activities
export const getTodaysReports = asyncHandler(async (req, res) => {
  const { activitiesMoodSort = 'desc' } = req.query;

  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reports = await dailyReport.find({
    userId: req.user.id,
    date: { $gte: today, $lt: tomorrow },
  })
  .populate('userId', 'name email')
  .populate('activities')
  .sort({ createdAt: 1 });

  reports.forEach(report => {
    if(report.activities.length > 0){
      report.activities = sortActivitiesByMood(report.activities, activitiesMoodSort);
    }
  });

  const reportStatus = {
    morning: reports.find(r => r.type === 'start') || null,
    evening: reports.find(r => r.type === 'end') || null,
    hasCompletedBoth: reports.length === 2,
  };

  res.status(200).json({
    success: true,
    reports,
    reportStatus,
  });
});

// Get Report by ID (with sorted activities)
export const getDailyReportById = asyncHandler(async (req, res) => {
  const { activitiesMoodSort='desc' } = req.query;

  const report = await dailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id,
  })
  .populate('userId', 'name email riskLevel')
  .populate('activities');

  if(!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  if(report.activities.length > 0){
    report.activities = sortActivitiesByMood(report.activities, activitiesMoodSort);
  }

  res.status(200).json({
    success: true,
    report,
  });
});

// Update Report
export const updateDailyReport = asyncHandler(async (req, res) => {
  const { mood, sleepHours, activities, notes, name } = req.body;

  const report = await dailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if(!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const reportDate = new Date(report.date);
  reportDate.setHours(0,0,0,0);

  if(reportDate.getTime() !== today.getTime()){
    res.status(400);
    throw new Error('You can only edit today\'s report');
  }

  if(activities && activities.length > 0){
    const validActivities = await activitiesModel.find({
      _id: { $in: activities },
    });

    if(validActivities.length !== activities.length){
      res.status(400);
      throw new Error('Invalid activities');
    }
  }

  if(name) report.name = name.trim();
  if(report.type === 'start' && sleepHours !== undefined) report.sleepHours = sleepHours;
  if(report.type === 'end' && mood !== undefined) report.mood = mood;
  if(activities !== undefined) report.activities = activities;
  if(notes !== undefined) report.notes = notes;

  await report.save();
  await report.populate('activities');
  if(report.activities.length > 0){
    report.activities = sortActivitiesByMood(report.activities);
  }
  await report.populate('userId', 'name email riskLevel');

  res.status(200).json({
    success: true,
    message: 'Report updated successfully',
    report,
  });
});

// Delete Report
export const deleteDailyReport = asyncHandler(async (req, res) => {
  const report = await dailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if(!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const today = new Date();
  today.setHours(0,0,0,0);
  const reportDate = new Date(report.date);
  reportDate.setHours(0,0,0,0);

  if(reportDate.getTime() !== today.getTime()){
    res.status(400);
    throw new Error('You can only delete today\'s report');
  }

  await report.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Report deleted successfully',
  });
});

// Weekly summary analytics
export const getWeeklySummary = asyncHandler(async (req, res) => {
  const { weekOffset = 0 } = req.query;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() - (weekOffset * 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const reports = await dailyReport.find({
    userId: req.user.id,
    date: { $gte: startOfWeek, $lt: endOfWeek }
  });

  const morningReports = reports.filter(r => r.type === 'start');
  const eveningReports = reports.filter(r => r.type === 'end');

  const avgSleep = morningReports.length > 0 ? morningReports.reduce((sum, r) => sum + (r.sleepHours || 0), 0) / morningReports.length : 0;
  const avgMood = eveningReports.length > 0 ? eveningReports.reduce((sum, r) => sum + (r.mood || 0), 0) / eveningReports.length : 0;

  const activityCounts = {};
  reports.forEach(r => {
    if(r.activities?.length){
      r.activities.forEach(act => {
        activityCounts[act.toString()] = (activityCounts[act.toString()] || 0) + 1;
      });
    }
  });

  const topActivities = Object.entries(activityCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0,5)
    .map(([id, count]) => ({ id, count }));

  // Prepare daily breakdown
  const dailyBreakdown = [];
  for(let i=0; i<7; i++){
    let day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    day.setHours(0,0,0,0);
    const reportsOfDay = reports.filter(r => {
      let rd = new Date(r.date);
      rd.setHours(0,0,0,0);
      return rd.getTime() === day.getTime();
    });
    const morning = reportsOfDay.find(r => r.type === 'start');
    const evening = reportsOfDay.find(r => r.type === 'end');

    dailyBreakdown.push({
      date: day.toISOString().split('T')[0],
      morningReport: morning || null,
      eveningReport: evening || null,
      activities: reportsOfDay.flatMap(r => r.activities || []),
    });
  }

  res.status(200).json({
    success: true,
    summary: {
      startOfWeek: startOfWeek.toISOString(),
      endOfWeek: new Date(endOfWeek.getTime() - 1).toISOString(),
      totalReports: reports.length,
      avgSleep,
      avgMood,
      topActivities,
      dailyBreakdown,
    }
  });
});

// Mood trends analytics
export const getMoodTrends = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  fromDate.setHours(0, 0, 0, 0);

  const reports = await dailyReport.find({
    userId: req.user.id,
    type: 'end',
    mood: { $exists: true },
    date: { $gte: fromDate }
  }).sort({ date: 1 });

  const trendData = reports.map(r => ({
    date: r.date.toISOString().split('T')[0],
    mood: r.mood,
    activities: r.activities,
    notes: r.notes
  }));

  const moods = reports.map(r => r.mood);
  const avgMood = moods.length > 0 ? moods.reduce((a,b) => a+b, 0) / moods.length : 0;

  // Basic trend detection
  let trend = 'stable';
  if(moods.length >= 7){
    const firstWeekAvg = moods.slice(0,7).reduce((a,b) => a+b, 0) / 7;
    const lastWeekAvg = moods.slice(-7).reduce((a,b) => a+b, 0) / 7;
    if(lastWeekAvg > firstWeekAvg + 0.5) trend = 'improving';
    else if(lastWeekAvg < firstWeekAvg - 0.5) trend = 'declining';
  }

  res.status(200).json({
    success: true,
    trendData,
    avgMood: Math.round(avgMood * 10) / 10,
    trend,
    periodDays: parseInt(days),
  });
});

export const getDailyReportsWithAggregation = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  // Build match criteria based on query params
  const match = {
    userId: req.user.id,
  };
  if (type) {
    match.type = type;
  }
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  // Map sort parameters
  const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
  const sort = {};
  sort[sortBy] = sortDirection;

  const aggregationPipeline = [
    { $match: match },
    {
      $lookup: {
        from: 'activities', // collection name should be the actual MongoDB collection name of Activity
        localField: 'activities',
        foreignField: '_id',
        as: 'activities',
      }
    },
    {
      // Add a field "moodPriority" to each activity to enable sorting
      $addFields: {
        activities: {
          $map: {
            input: '$activities',
            as: 'activity',
            in: {
              $mergeObjects: [
                '$$activity',
                {
                  moodPriority: {
                    $switch: {
                      branches: [
                        { case: { $eq: ['$$activity.mood', 'none'] }, then: MOOD_PRIORITY.none },
                        { case: { $eq: ['$$activity.mood', 'mild'] }, then: MOOD_PRIORITY.mild },
                        { case: { $eq: ['$$activity.mood', 'moderate'] }, then: MOOD_PRIORITY.moderate },
                        { case: { $eq: ['$$activity.mood', 'severely moderate'] }, then: MOOD_PRIORITY["severely moderate"] },
                        { case: { $eq: ['$$activity.mood', 'severe'] }, then: MOOD_PRIORITY.severe }
                      ],
                      default: 0
                    }
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      // Sort the activities array by moodPriority descending
      $addFields: {
        activities: {
          $sortArray: {
            input: '$activities',
            sortBy: { moodPriority: -1 }
          }
        }
      }
    },
    {
      // Remove moodPriority field before returning
      $addFields: {
        activities: {
          $map: {
            input: '$activities',
            as: 'activity',
            in: {
              _id: '$$activity._id',
              type: '$$activity.type',
              link: '$$activity.link',
              mood: '$$activity.mood',
              createdAt: '$$activity.createdAt',
              updatedAt: '$$activity.updatedAt'
            }
          }
        }
      }
    },
    { $sort: sort },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: 0,
        'user.password': 0,
        'user.__v': 0,
      }
    }
  ];

  const reports = await dailyReport.aggregate(aggregationPipeline);
  const totalReports = await dailyReport.countDocuments(match);

  res.status(200).json({
    success: true,
    reports,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReports / limit),
      totalReports,
      hasNextPage: page * limit < totalReports,
      hasPrevPage: page > 1,
    }
  });
});

// Get activities sorted by mood for a report
export const getActivitiesSortedMood = asyncHandler(async (req, res) => {
  const { sortOrder = 'desc' } = req.query;
  const report = await dailyReport.findOne({
    _id: req.params.id,
    userId: req.user.id,
  }).populate('activities');

  if(!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const sortedActivities = sortActivitiesByMood([...report.activities], sortOrder);

  res.status(200).json({
    success: true,
    activities: sortedActivities,
    moodPriority: MOOD_PRIORITY,
    sortOrder,
  });
});

export const getActivitiesSortedByMood = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sortOrder = 'desc' } = req.query;

  const report = await dailyReport.findOne({ _id: id, userId: req.user.id }).populate('activities');

  if (!report) {
    res.status(404);
    throw new Error('Daily report not found');
  }

  const sortedActivities = sortActivitiesByMood([...report.activities], sortOrder);

  res.status(200).json({
    success: true,
    activities: sortedActivities,
    moodPriority: MOOD_PRIORITY,
    sortOrder
  });
});

export { MOOD_PRIORITY, sortActivitiesByMood };
