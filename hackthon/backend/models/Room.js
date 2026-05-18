const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., 'Single', 'Double', 'Suite'
  status: { 
    type: String, 
    required: true, 
    enum: ['Ready', 'Occupied', 'Dirty', 'Maintenance'],
    default: 'Ready'
  },
  floor: { type: Number, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
