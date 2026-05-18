const MaintenanceTicket = require('../models/MaintenanceTicket');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

// @desc    Get all maintenance tickets
// @route   GET /api/maintenance
// @access  Private
const getTickets = async (req, res) => {
  try {
    const tickets = await MaintenanceTicket.find({})
      .populate('room')
      .populate('reportedBy', 'name email')
      .populate('assignee', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create maintenance ticket
// @route   POST /api/maintenance
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { title, description, room, priority } = req.body;
    
    const ticket = await MaintenanceTicket.create({
      title,
      description,
      room,
      reportedBy: req.user._id,
      priority
    });

    const populatedTicket = await MaintenanceTicket.findById(ticket._id)
      .populate('room')
      .populate('reportedBy', 'name email');
      
    const io = req.app.get('io');
    
    // Business Logic: When maintenance ticket is created, room status becomes Maintenance
    if (room) {
      const roomDoc = await Room.findById(room);
      if (roomDoc && roomDoc.status !== 'Maintenance') {
        roomDoc.status = 'Maintenance';
        await roomDoc.save();
        if (io) io.emit('roomStatusUpdated', roomDoc);
      }
    }

    if (io) {
      io.emit('maintenanceCreated', populatedTicket);
      io.emit('dashboardUpdated');
      
      const notification = await Notification.create({
        message: `New maintenance ticket: ${title}`,
        type: 'Maintenance'
      });
      io.emit('notificationSent', notification);
    }

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/maintenance/:id/status
// @access  Private
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await MaintenanceTicket.findById(req.params.id).populate('room');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    const updatedTicket = await ticket.save();
    
    const io = req.app.get('io');

    // Business Logic: When maintenance is Resolved, room status becomes Ready
    if (status === 'Resolved' && ticket.room) {
      const room = await Room.findById(ticket.room._id);
      if (room) {
        room.status = 'Ready';
        await room.save();
        if (io) io.emit('roomStatusUpdated', room);
        
        const notification = await Notification.create({
          message: `Maintenance resolved for Room ${room.roomNumber}`,
          type: 'RoomStatus'
        });
        if (io) io.emit('notificationSent', notification);
      }
    }

    if (io) {
      io.emit('maintenanceUpdated', updatedTicket);
      io.emit('dashboardUpdated');
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign ticket
// @route   PUT /api/maintenance/:id/assign
// @access  Private
const assignTicket = async (req, res) => {
  try {
    const { assigneeId } = req.body;
    const ticket = await MaintenanceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.assignee = assigneeId;
    const updatedTicket = await ticket.save();
    
    const populatedTicket = await MaintenanceTicket.findById(updatedTicket._id)
      .populate('room')
      .populate('reportedBy', 'name email')
      .populate('assignee', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('maintenanceUpdated', populatedTicket);

    res.json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/maintenance/:id
// @access  Private/Manager
const deleteTicket = async (req, res) => {
  try {
    const ticket = await MaintenanceTicket.findById(req.params.id);

    if (ticket) {
      await ticket.deleteOne();
      const io = req.app.get('io');
      if (io) {
        io.emit('maintenanceUpdated', { _id: req.params.id, deleted: true });
        io.emit('dashboardUpdated');
      }
      res.json({ message: 'Ticket removed' });
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTickets, createTicket, updateTicketStatus, assignTicket, deleteTicket };
