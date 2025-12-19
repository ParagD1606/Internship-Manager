const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Engagement = require("../models/Engagement");
const auth = require("../middleware/authMiddleware");

// 1. Multer Config: Files 'uploads/certificates/' mein save hongi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/certificates/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 2. POST: Internship Certificate Upload
router.post("/:id/upload-certificate", auth, upload.single("certificate"), async (req, res) => {
  try {
    const engagement = await Engagement.findById(req.params.id);
    if (!engagement) return res.status(404).json({ message: "Internship not found" });

    // File path save karna aur status update karna
    engagement.certificateUrl = `/uploads/certificates/${req.file.filename}`;
    engagement.status = "COMPLETED"; 
    
    await engagement.save();
    res.json({ 
      message: "Certificate uploaded and internship marked as COMPLETED!", 
      url: engagement.certificateUrl 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during file upload" });
  }
});

module.exports = router;