const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Room = require('../models/Room');
const Task = require('../models/Task');
const MaintenanceTicket = require('../models/MaintenanceTicket');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Room.deleteMany();
    await Task.deleteMany();
    await MaintenanceTicket.deleteMany();
    await Notification.deleteMany();

    // 1. Create Users
    const createdUsers = await User.create([
      { name: 'Manager User', email: 'manager@hotelops.com', password: 'password123', role: 'manager' },
      { name: 'Front Desk User', email: 'frontdesk@hotelops.com', password: 'password123', role: 'frontdesk' },
      { name: 'Housekeeper User', email: 'housekeeping@hotelops.com', password: 'password123', role: 'housekeeping' },
      { name: 'Maintenance User', email: 'maintenance@hotelops.com', password: 'password123', role: 'maintenance' },
    ]);

    const manager = createdUsers[0]._id;
    const housekeeper = createdUsers[2]._id;
    const maintenanceStaff = createdUsers[3]._id;

    // 2. Create Rooms (20 rooms)
    const roomTypes = ['Single', 'Double', 'Suite'];
    const floors = [1, 2, 3];
    const statuses = ['Ready', 'Occupied', 'Dirty', 'Maintenance'];
    
    const rooms = [];
    for (let i = 1; i <= 20; i++) {
      rooms.push({
        roomNumber: `${floors[i % 3]}${i < 10 ? '0' + i : i}`,
        type: roomTypes[i % 3],
        floor: floors[i % 3],
        price: 100 + (i % 3) * 50,
        status: statuses[i % 4]
      });
    }
    const createdRooms = await Room.insertMany(rooms);

    // 3. Create Sample Tasks
    const dirtyRooms = createdRooms.filter(r => r.status === 'Dirty');
    const tasks = dirtyRooms.map(r => ({
      title: `Clean Room ${r.roomNumber}`,
      description: 'Regular cleaning required',
      room: r._id,
      assignee: housekeeper,
      status: 'Pending',
      priority: 'High',
      type: 'Cleaning'
    }));
    await Task.insertMany(tasks);

    // 4. Create Sample Maintenance Tickets
    const maintenanceRooms = createdRooms.filter(r => r.status === 'Maintenance');
    const tickets = maintenanceRooms.map(r => ({
      title: `Fix AC in Room ${r.roomNumber}`,
      description: 'AC is leaking water',
      room: r._id,
      reportedBy: manager,
      assignee: maintenanceStaff,
      status: 'Open',
      priority: 'High'
    }));
    await MaintenanceTicket.insertMany(tickets);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
