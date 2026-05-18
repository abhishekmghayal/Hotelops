const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  priority: { 
    type: String, 
    required: true, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['Cleaning', 'Room Service', 'Other'],
    default: 'Cleaning'
  },
  proofImage: { type: String } // URL or path to uploaded proof image
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
