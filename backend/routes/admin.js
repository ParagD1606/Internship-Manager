const express = require("express");
const router = express.Router();
const WeeklyProgress = require("../models/WeeklyProgress");
const Engagement = require("../models/Engagement");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// =======================================================
// 1. GET ALL PROJECTS/ENGAGEMENTS (Naya Task Assign karne ke liye)
// =======================================================
router.get("/all-engagements", auth, async (req, res) => {
  try {
    // Saare students jinhone Project ya Internship join ki hai unhe fetch karna
    const engagements = await Engagement.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    
    res.json(engagements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching engagements for assignment" });
  }
});

// =======================================================
// 2. GET DASHBOARD METRICS
// =======================================================
router.get("/dashboard-stats", auth, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const activeProjects = await Engagement.countDocuments({ type: "PROJECT" });
    const pendingApprovals = await WeeklyProgress.countDocuments({ reviewStatus: "PENDING_REVIEW" });
    const completedInternships = await Engagement.countDocuments({ 
      type: "INTERNSHIP", 
      status: "COMPLETED" 
    });

    const totalLogs = await WeeklyProgress.countDocuments();
    const approvedLogs = await WeeklyProgress.countDocuments({ reviewStatus: "APPROVED" });
    const placementRate = totalLogs > 0 ? ((approvedLogs / totalLogs) * 100).toFixed(1) : 0;

    res.json({
      totalStudents,
      activeProjects,
      pendingApprovals,
      completedInternships,
      placementRate
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

// =======================================================
// 3. GET PENDING APPROVALS (Review Queue)
// =======================================================
router.get("/pending-approvals", auth, async (req, res) => {
  try {
    const logs = await WeeklyProgress.find({ reviewStatus: "PENDING_REVIEW" })
      .populate("studentId", "name") 
      .populate("engagementId", "title") 
      .sort({ submittedAt: -1 });

    const formattedLogs = logs.map(log => ({
      _id: log._id,
      engagementId: log.engagementId?._id,
      studentId: log.studentId?._id,
      weekNumber: log.weekNumber,
      studentName: log.studentId?.name || "Unknown",
      projectTitle: log.engagementId?.title || "No Title",
      summary: log.summary,
      tasks: log.tasks,
      evidenceLinks: log.evidenceLinks,
      submittedAt: log.submittedAt
    }));

    res.json(formattedLogs);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching approvals" });
  }
});

// =======================================================
// 4. REVIEW ACTION (APPROVE/REJECT)
// =======================================================
router.patch("/review-log/:id", auth, async (req, res) => {
  try {
    const { status } = req.body; 
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const log = await WeeklyProgress.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    log.reviewStatus = status;
    log.reviewedAt = Date.now();
    await log.save();

    res.json({ message: `Log successfully ${status.toLowerCase()}`, log });
  } catch (err) {
    res.status(500).json({ message: "Server error during review" });
  }
});

// =======================================================
// 5. GET SYSTEM AUDIT LOGS (Activity Pulse)
// =======================================================
router.get("/audit-logs", auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentSubmissions = await WeeklyProgress.find()
      .populate("studentId", "name")
      .populate("engagementId", "title type")
      .sort({ updatedAt: -1 })
      .limit(limit);

    const activities = recentSubmissions.map(item => ({
      id: item._id,
      userName: item.studentId?.name || "System",
      action: item.reviewStatus === "PENDING_REVIEW" ? "submitted work for" : `milestone ${item.reviewStatus.toLowerCase()} for`,
      targetName: item.engagementId?.title || "Project",
      type: item.engagementId?.type || "PROJECT",
      timeAgo: "Recently"
    }));

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching audit logs" });
  }
});

module.exports = router;