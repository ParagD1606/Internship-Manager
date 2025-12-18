const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  opportunity: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Opportunity', 
    required: true 
  },
  resumeLink: { 
    type: String, 
    required: true // 👈 New Field: Resume is mandatory
  },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Accepted'], 
    default: 'Applied' 
  },
  appliedAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications
ApplicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);