const Room = require('../models/Room');
const Task = require('../models/Task');
const MaintenanceTicket = require('../models/MaintenanceTicket');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const readyRooms = await Room.countDocuments({ status: 'Ready' });
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const dirtyRooms = await Room.countDocuments({ status: 'Dirty' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Maintenance' });

    const pendingTasks = await Task.countDocuments({ status: { $ne: 'Completed' } });
    const openTickets = await MaintenanceTicket.countDocuments({ status: { $ne: 'Resolved' } });

    res.json({
      rooms: {
        total: totalRooms,
        ready: readyRooms,
        occupied: occupiedRooms,
        dirty: dirtyRooms,
        maintenance: maintenanceRooms
      },
      tasks: {
        pending: pendingTasks
      },
      maintenance: {
        open: openTickets
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
