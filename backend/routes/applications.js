const router = require('express').Router();
const Application = require('../models/Application');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. SETUP UPLOAD STORAGE ---
const uploadDir = path.join(__dirname, '../uploads/application_resumes');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`)
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF resumes are allowed!'));
        }
        cb(null, true);
    }
});

// 📌 APPLY TO OPPORTUNITY (Now with File Upload)
router.post('/apply/:id', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: "Please upload your resume." });

        const studentId = req.user.id;
        const opportunityId = req.params.id;
        const resumeUrl = `http://localhost:8080/uploads/application_resumes/${req.file.filename}`;

        // Check if already applied
        const existingApp = await Application.findOne({ student: studentId, opportunity: opportunityId });
        if(existingApp) return res.status(400).json({ msg: "Already applied!" });

        const newApp = new Application({
            student: studentId,
            opportunity: opportunityId,
            resumeLink: resumeUrl // 👈 Save the file URL
        });

        await newApp.save();
        res.json(newApp);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 📌 GET STUDENT'S APPLICATIONS
router.get('/my-applications', auth, async (req, res) => {
    try {
        const apps = await Application.find({ student: req.user.id })
            .populate('opportunity')
            .sort({ appliedAt: -1 });
        res.json(apps);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;