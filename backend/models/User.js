const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'owner'], default: 'student' },
  
  // existing fields...
  collegeName: { type: String, default: '' },
  collegeCode: { type: String, sparse: true },
  branch: { type: String, default: '' },
  year: { type: String, default: '' },
  cgpa: { type: String, default: '' },
  
  // --- NEW PROFILE FIELDS ---
  about: { type: String, default: '' },
  skills: { type: [String], default: [] },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  resumeLink: { type: String, default: '' },
  profilePic: { type: String, default: '' }, // URL to image
  coverPic: { type: String, default: '' }, // 👈 Add this new field
  
  // security...
  verificationDoc: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);