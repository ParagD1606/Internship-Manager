const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application'); // Import the new model

// --- 1. POST A NEW JOB ---
router.post('/', auth, async (req, res) => {
    try {
        const { title, company, type, description, skills, location, deadline } = req.body;
        
        // Auto-fill college info from the logged-in faculty
        const newOpp = new Opportunity({
            title,
            company,
            type,
            description,
            skills: skills.split(',').map(s => s.trim()),
            location,
            deadline,
            postedBy: req.user.id,
            collegeName: req.user.collegeName || 'General' // Tag the job with college
        });

        const savedOpp = await newOpp.save();
        res.json(savedOpp);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET ALL JOBS (For Students) ---
router.get('/', auth, async (req, res) => {
    try {
        // Students see:
        // 1. Jobs from "All" (General pool)
        // 2. Jobs matching their collegeName
        // (We return all here, filtering happens on frontend or we can filter here)
        const opportunities = await Opportunity.find().sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 3. GET "MY POSTS" (For Faculty Dashboard) ---
router.get('/my-posts', auth, async (req, res) => {
    try {
        const posts = await Opportunity.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 4. APPLY TO A JOB (For Students) ---
router.post('/:id/apply', auth, async (req, res) => {
    try {
        const jobId = req.params.id;
        const student = req.user; // From auth middleware

        // Check if already applied
        const existing = await Application.findOne({ jobId, studentId: student.id });
        if(existing) return res.status(400).json({ msg: "Already applied" });

        // Fetch User details to save in application (snapshot)
        // Note: You might want to query User model here if req.user doesn't have details
        const application = new Application({
            jobId,
            studentId: student.id,
            studentName: student.name || 'Student', // Ideally fetch from DB if missing in token
            studentEmail: student.email,
            status: 'Pending'
        });

        await application.save();
        res.json({ msg: "Applied Successfully!" });

    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- 5. VIEW APPLICATIONS (For Faculty) ---
router.get('/applications/my-jobs', auth, async (req, res) => {
    try {
        // 1. Find IDs of jobs posted by this faculty
        const myJobs = await Opportunity.find({ postedBy: req.user.id }).select('_id');
        const jobIds = myJobs.map(job => job._id);

        // 2. Find applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title company type') // Add Job Details
            .populate('studentId', 'name email branch cgpa') // Add Student Details
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- 6. UPDATE STATUS (Accept/Reject) ---
router.put('/application/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        // Basic validation
        if(!['Accepted', 'Rejected', 'Shortlisted'].includes(status)) {
            return res.status(400).json({msg: "Invalid Status"});
        }

        const app = await Application.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(app);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});
// 📌 7. DELETE A JOB
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Opportunity.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        // Security: Ensure only the creator can delete
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await job.deleteOne();
        
        // Optional: Delete associated applications too?
        // await Application.deleteMany({ jobId: req.params.id });

        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 📌 8. GET MY APPLICATIONS (For Student Dashboard)
router.get('/student/my-applications', auth, async (req, res) => {
    try {
        // Find apps where studentId matches the logged-in user
        const apps = await Application.find({ studentId: req.user.id })
            .populate('jobId', 'title company type') // Get job details
            .sort({ appliedAt: -1 }); // Newest first

        res.json(apps);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 📌 CREATE OPPORTUNITY (Faculty/Admin Only)
router.post('/create', auth, async (req, res) => {
    try {
        // Optional: Check if user is faculty
        if (req.user.role !== 'faculty' && req.user.role !== 'owner') {
            return res.status(403).json({ msg: "Access Denied. Only Faculty can post." });
        }

        const { title, type, company, location, stipend, description, deadline, applyLink } = req.body;

        const newOpp = new Opportunity({
            title, type, company, location, stipend, description, deadline, applyLink,
            postedBy: req.user.id
        });

        await newOpp.save();
        res.json(newOpp);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 📌 GET ALL OPPORTUNITIES (For Students)
router.get('/', auth, async (req, res) => {
    try {
        // Sort by newest first
        const opportunities = await Opportunity.find().sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 📌 DELETE OPPORTUNITY
router.delete('/:id', auth, async (req, res) => {
    try {
        const opp = await Opportunity.findById(req.params.id);
        if(!opp) return res.status(404).json({ msg: "Not Found" });

        // Check ownership
        if(opp.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not Authorized" });
        }

        await opp.deleteOne();
        res.json({ msg: "Opportunity Removed" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;