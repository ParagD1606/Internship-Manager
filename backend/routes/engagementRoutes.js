const express = require("express");
const router = express.Router();
const Engagement = require("../models/Engagement");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or image files allowed"));
    }
  },
});

// =======================================================
// GET all engagements for logged-in student
// =======================================================
router.get("/my", auth, async (req, res) => {
  try {
    const engagements = await Engagement.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(engagements);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================================================
// UPLOAD INTERNSHIP CERTIFICATE (COMPLETED ONLY)
// =======================================================
router.post(
  "/:id/upload-certificate",
  auth,
  upload.single("certificate"),
  async (req, res) => {
    try {
      const engagement = await Engagement.findById(req.params.id);

      if (!engagement) {
        return res.status(404).json({ message: "Engagement not found" });
      }

      // 🔒 Only INTERNSHIP allowed
      if (engagement.type !== "INTERNSHIP") {
        return res
          .status(403)
          .json({ message: "Certificate upload allowed only for internships" });
      }

      // 🔒 Only COMPLETED internships
      if (engagement.status !== "COMPLETED") {
        return res.status(403).json({
          message: "Internship must be completed before uploading certificate",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      engagement.certificate = `/uploads/certificates/${req.file.filename}`;
      engagement.certificateStatus = "PENDING_VERIFICATION";

      await engagement.save();

      res.json({
        message: "Certificate uploaded successfully",
        certificate: engagement.certificate,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
