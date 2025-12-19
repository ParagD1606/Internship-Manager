const express = require("express");
const router = express.Router();
const WeeklyProgress = require("../models/WeeklyProgress");
const Engagement = require("../models/Engagement");
const auth = require("../middleware/authMiddleware");

// =======================================================
// 1. GET ALL LOGS FOR STUDENT (Dashboard View)
// =======================================================
router.get("/:engagementId", auth, async (req, res) => {
  try {
    const progress = await WeeklyProgress.find({
      engagementId: req.params.engagementId,
      studentId: req.user.id,
    }).sort({ weekNumber: 1 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================================================
// 2. ADMIN: ASSIGN NEW TASK (Creates the Record)
// =======================================================
router.post("/assign-task", auth, async (req, res) => {
  try {
    const { engagementId, studentId, weekNumber, tasks } = req.body;

    // Check if task already exists for this week
    const existing = await WeeklyProgress.findOne({ engagementId, weekNumber });
    if (existing) {
      return res.status(400).json({ message: `Week ${weekNumber} is already assigned.` });
    }

    const newTask = new WeeklyProgress({
      engagementId,
      studentId,
      weekNumber: Number(weekNumber),
      // Array handling for tasks
      tasks: Array.isArray(tasks) ? tasks : tasks.split(',').map(t => t.trim()),
      reviewStatus: "ASSIGNED" // Matches Model Enum
    });

    await newTask.save();
    res.json({ message: "Task assigned successfully!", newTask });
  } catch (err) {
    console.error("Assign Task Error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// =======================================================
// 3. STUDENT: SUBMIT WORK (Updates Assigned Task)
// =======================================================
router.patch("/submit-work/:taskId", auth, async (req, res) => {
  try {
    const { summary, evidenceLinks } = req.body;
    
    const progress = await WeeklyProgress.findById(req.params.taskId);
    if (!progress) return res.status(404).json({ message: "Task not found" });

    progress.summary = summary;
    progress.evidenceLinks = evidenceLinks;
    progress.reviewStatus = "PENDING_REVIEW"; // Matches Model Enum
    progress.submittedAt = Date.now();

    await progress.save();
    res.json({ message: "Work submitted! Pending Admin Approval.", progress });
  } catch (err) {
    res.status(500).json({ message: "Server error during submission" });
  }
});

// =======================================================
// 4. ADMIN: REVIEW LOG (Approve/Reject)
// =======================================================
router.patch("/review-log/:id", auth, async (req, res) => {
  try {
    const { status } = req.body; // Expects 'APPROVED' or 'REJECTED'
    
    // Safety check for status values
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const log = await WeeklyProgress.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Log not found" });

    log.reviewStatus = status; // Matches Model Enum
    log.reviewedAt = Date.now();
    await log.save();

    res.json({ message: `Log marked as ${status}`, log });
  } catch (err) {
    res.status(500).json({ message: "Server error during review" });
  }
});

module.exports = router;