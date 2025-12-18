const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // e.g., "Application Shortlisted"
  message: { type: String }, // e.g., "AI Traffic System • Smart City Lab"
  type: { type: String, enum: ['info', 'success', 'warning', 'alert'], default: 'info' },
  link: { type: String, default: '' }, // Where to go when clicked (e.g., "Applications")
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);