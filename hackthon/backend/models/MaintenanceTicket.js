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
    enum: ['Open', 'In Progress', 'Waiting Parts', 'Resolved'],
    default: 'Open'
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  category: { type: String, default: 'General' },
  asset: { type: String, default: '' },
  locationNote: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  partsUsed: { type: String, default: '' },
  estimatedCost: { type: Number, default: 0 },
  laborMinutes: { type: Number, default: 0 },
  vendorRequired: { type: Boolean, default: false },
  safetyLockout: { type: Boolean, default: false },
  followUpRequired: { type: Boolean, default: false },
  followUpNotes: { type: String, default: '' },
  resolutionNotes: { type: String, default: '' },
  startedAt: { type: Date },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTicket', maintenanceTicketSchema);
