const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Internship', 'Job', 'Hackathon', 'Workshop'], 
    required: true 
  },
  company: { type: String, required: true }, // Or "Organizer"
  location: { type: String, default: 'Remote' },
  stipend: { type: String, default: 'Unpaid' }, // e.g., "10k/month"
  description: { type: String },
  deadline: { type: Date, required: true },
  applyLink: { type: String, required: true }, // External URL or Email
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);