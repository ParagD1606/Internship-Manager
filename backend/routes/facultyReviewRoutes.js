const express = require("express");
const router = express.Router();
const WeeklyProgress = require("../models/WeeklyProgress");
const auth = require("../middleware/authMiddleware");

// Get all pending reviews
router.get("/pending", auth, async (req, res) => {
  const pending = await WeeklyProgress.find({
    reviewStatus: "PENDING",
  }).populate("studentId engagementId");

  res.json(pending);
});

// Review a submission
router.post("/review/:id", auth, async (req, res) => {
  const { decision, comment } = req.body;

  await WeeklyProgress.findByIdAndUpdate(req.params.id, {
    reviewStatus: decision,
    teacherComment: comment,
  });

  res.json({ message: "Review updated" });
});

module.exports = router;
