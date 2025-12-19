const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    // ===================== CORE LINK =====================
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===================== TYPE =====================
    // INTERNSHIP or ACADEMIC PROJECT
    type: {
      type: String,
      enum: ["INTERNSHIP", "PROJECT"],
      required: true,
    },

    // ===================== BASIC DETAILS =====================
    title: {
      type: String,
      required: true,
    },

    organization: {
      // Company name OR faculty/department name
      type: String,
      required: true,
    },

    // ===================== STATUS FLOW =====================
    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "APPROVED",
        "ONGOING",
        "COMPLETED",
        "REJECTED",
      ],
      default: "APPLIED",
    },

    // ===================== DATES =====================
    startDate: Date,
    endDate: Date,

    // ===================== INTERNSHIP ONLY =====================
    // Student uploads certificate ONLY after COMPLETED
    certificate: {
      type: String, // file path or cloud URL
    },

    certificateStatus: {
      type: String,
      enum: ["PENDING_VERIFICATION", "VERIFIED"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Engagement", engagementSchema);
