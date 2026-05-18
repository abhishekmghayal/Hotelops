const Task = require('../models/Task');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('room').populate('assignee', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, room, assignee, priority, type, checklist, notes } = req.body;
    
    const task = await Task.create({
      title,
      description,
      room,
      assignee,
      priority,
      type,
      checklist,
      notes
    });

    const populatedTask = await Task.findById(task._id).populate('room').populate('assignee', 'name email');
    
    const io = req.app.get('io');
    if (io) {
      io.emit('taskCreated', populatedTask);
      io.emit('dashboardUpdated');
    }

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status, checklist, notes, inspected } = req.body;
    const task = await Task.findById(req.params.id).populate('room');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = status;
    if (Array.isArray(checklist)) task.checklist = checklist;
    if (typeof notes === 'string') task.notes = notes;
    if (typeof inspected === 'boolean') task.inspected = inspected;
    if (status === 'In Progress' && !task.startedAt) task.startedAt = new Date();
    if (status === 'Completed') task.completedAt = new Date();
    const updatedTask = await task.save();
    
    const io = req.app.get('io');

    // Business Logic: When cleaning task is Completed, room status becomes Ready
    if (task.type === 'Cleaning' && status === 'Completed' && task.room) {
      const room = await Room.findById(task.room._id);
      if (room) {
        room.status = 'Ready';
        await room.save();
        if (io) io.emit('roomStatusUpdated', room);
        
        const notification = await Notification.create({
          message: `Room ${room.roomNumber} is now Ready`,
          type: 'RoomStatus'
        });
        if (io) io.emit('notificationSent', notification);
      }
    }

    if (io) {
      io.emit('taskUpdated', updatedTask);
      io.emit('dashboardUpdated');
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign task to user
// @route   PUT /api/tasks/:id/assign
// @access  Private
const assignTask = async (req, res) => {
  try {
    const { assigneeId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignee = assigneeId;
    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id).populate('room').populate('assignee', 'name email');

    const io = req.app.get('io');
    if (io) io.emit('taskUpdated', populatedTask);

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload proof image
// @route   POST /api/tasks/:id/upload-proof
// @access  Private
const uploadProof = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.file) {
      task.proofImage = `/uploads/${req.file.filename}`;
      const updatedTask = await task.save();
      const populatedTask = await Task.findById(updatedTask._id).populate('room').populate('assignee', 'name email');
      
      const io = req.app.get('io');
      if (io) io.emit('taskUpdated', populatedTask);
      
      res.json(populatedTask);
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      const io = req.app.get('io');
      if (io) {
        io.emit('taskUpdated', { _id: req.params.id, deleted: true });
        io.emit('dashboardUpdated');
      }
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, assignTask, uploadProof, deleteTask };
