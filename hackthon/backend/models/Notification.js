const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Task', 'Maintenance', 'System', 'RoomStatus'] 
  },
  isRead: { type: Boolean, default: false },
  link: { type: String } // Optional link to navigate when clicked
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
