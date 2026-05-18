const Room = require('../models/Room');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Manager
const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, floor, price, guestName, guestPhone, guestEmail, notes } = req.body;
    const roomExists = await Room.findOne({ roomNumber });

    if (roomExists) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const room = await Room.create({
      roomNumber,
      type,
      floor,
      price,
      guestName,
      guestPhone,
      guestEmail,
      notes
    });
    
    // io event
    const io = req.app.get('io');
    if (io) io.emit('dashboardUpdated');

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update room status
// @route   PUT /api/rooms/:id/status
// @access  Private
const updateRoomStatus = async (req, res) => {
  try {
    const {
      status,
      guestName,
      guestPhone,
      guestEmail,
      checkOutAt,
      adults,
      children,
      bookingSource,
      paymentStatus,
      vip,
      doNotDisturb,
      lateCheckout,
      notes
    } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.status = status;

    if (typeof notes === 'string') {
      room.notes = notes;
    }

    if (status === 'Occupied') {
      room.guestName = guestName || room.guestName || 'Walk-in Guest';
      room.guestPhone = guestPhone || room.guestPhone || '';
      room.guestEmail = guestEmail || room.guestEmail || '';
      room.checkOutAt = checkOutAt || room.checkOutAt;
      room.adults = Number.isFinite(Number(adults)) ? Number(adults) : room.adults;
      room.children = Number.isFinite(Number(children)) ? Number(children) : room.children;
      room.bookingSource = bookingSource || room.bookingSource || 'Walk-in';
      room.paymentStatus = paymentStatus || room.paymentStatus || 'Pending';
      room.vip = typeof vip === 'boolean' ? vip : room.vip;
      room.doNotDisturb = typeof doNotDisturb === 'boolean' ? doNotDisturb : room.doNotDisturb;
      room.lateCheckout = typeof lateCheckout === 'boolean' ? lateCheckout : room.lateCheckout;
      room.checkInAt = room.checkInAt || new Date();
    }

    if (['Dirty', 'Ready', 'Maintenance'].includes(status)) {
      room.guestName = '';
      room.guestPhone = '';
      room.guestEmail = '';
      room.checkInAt = undefined;
      room.checkOutAt = undefined;
      room.adults = 1;
      room.children = 0;
      room.bookingSource = 'Walk-in';
      room.paymentStatus = 'Pending';
      room.vip = false;
      room.doNotDisturb = false;
      room.lateCheckout = false;
    }
    const updatedRoom = await room.save();

    const io = req.app.get('io');

    // Business Logic: If room status is Dirty, create cleaning task
    if (status === 'Dirty') {
      const task = await Task.create({
        title: `Clean Room ${room.roomNumber}`,
        description: 'Auto-generated cleaning task',
        room: room._id,
        type: 'Cleaning',
        priority: 'High'
      });
      if (io) io.emit('taskCreated', task);
      
      const notification = await Notification.create({
        message: `New cleaning task created for Room ${room.roomNumber}`,
        type: 'Task'
      });
      if (io) io.emit('notificationSent', notification);
    }

    if (io) {
      io.emit('roomStatusUpdated', updatedRoom);
      io.emit('dashboardUpdated');
    }

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Manager
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      const io = req.app.get('io');
      if (io) io.emit('dashboardUpdated');
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, createRoom, updateRoomStatus, deleteRoom };
