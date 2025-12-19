const mongoose = require("mongoose");

const weeklyProgressSchema = new mongoose.Schema(
  {
    engagementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engagement",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    summary: String,
    tasks: [String],
    evidenceLinks: [String],
    reviewStatus: {
      type: String,
      // Status ko routes ke sath sync kiya gaya hai
      enum: ["ASSIGNED", "PENDING_REVIEW", "APPROVED", "REJECTED", "REVISION"],
      default: "ASSIGNED", 
    },
    teacherComment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyProgress", weeklyProgressSchema);