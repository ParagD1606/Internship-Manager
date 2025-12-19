const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const internshipRoutes = require("./routes/internship");
const adminRoutes = require("./routes/admin");
const progressRoutes = require("./routes/progressRoutes");

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/opportunities', require('./routes/opportunities'));
//app.use('/uploads', express.static('uploads'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/ai-resume', require('./routes/ai-resume'));
app.use('/api/ai-interview', require('./routes/ai-interview'));
app.use('/api/ai-chatbot', require('./routes/ai-chatbot'));
app.use("/api/engagements", require("./routes/engagementRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/faculty", require("./routes/facultyReviewRoutes"));
app.use("/api/internship", internshipRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes); 
app.use("/api/progressRoutes", progressRoutes);

// --- DATABASE CONNECTION (DEBUGGED) ---
const connectDB = async () => {
    try {
        console.log("⏳ Attempting to connect to MongoDB...");
        // 1. Force wait for connection
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fail fast (5 sec) if no server found
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('💡 TIP: Is your MongoDB server running? Run "mongod" in a new terminal.');
        process.exit(1); // Stop server if DB fails
    }
};

// Connect DB first, THEN start server
connectDB().then(() => {
    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/opportunities', require('./routes/opportunities'));
    app.use('/api/notifications', require('./routes/notifications'));
  

    const PORT = process.env.PORT || 5000;
   // app.use('/uploads', express.static('uploads'));
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});