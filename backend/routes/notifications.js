const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// 📌 GET MY NOTIFICATIONS
router.get('/', auth, async (req, res) => {
    try {
        const notifs = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10); // Get last 10
        res.json(notifs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 📌 MARK ALL AS READ
router.put('/mark-read', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ msg: 'All marked as read' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 📌 (OPTIONAL) CREATE MOCK NOTIFICATIONS (Run this once via Postman to seed data)
router.post('/seed', auth, async (req, res) => {
    try {
        const mocks = [
            { recipient: req.user.id, title: "Application Shortlisted", message: "AI Traffic System • Smart City Lab", type: "success", link: "Applications" },
            { recipient: req.user.id, title: "New Opportunity", message: "Cyber Security Analyst @ TechCorp", type: "info", link: "Opportunities" },
            { recipient: req.user.id, title: "Profile Reminder", message: "Please update your resume", type: "warning", link: "My Profile" }
        ];
        await Notification.insertMany(mocks);
        res.json({ msg: "Seeded notifications" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;