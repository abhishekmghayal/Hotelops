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
  price: { type: Number, required: true },
  guestName: { type: String, default: '' },
  guestPhone: { type: String, default: '' },
  guestEmail: { type: String, default: '' },
  checkInAt: { type: Date },
  checkOutAt: { type: Date },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  bookingSource: { type: String, default: 'Walk-in' },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Authorized', 'Paid'], 
    default: 'Pending' 
  },
  vip: { type: Boolean, default: false },
  doNotDisturb: { type: Boolean, default: false },
  lateCheckout: { type: Boolean, default: false },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
