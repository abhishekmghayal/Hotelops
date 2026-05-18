const mongoose = require('mongoose');

const maintenanceTicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  category: { type: String, default: 'General' },
  diagnosis: { type: String, default: '' },
  partsUsed: { type: String, default: '' },
  resolutionNotes: { type: String, default: '' },
  startedAt: { type: Date },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
