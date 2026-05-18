const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoomStatus, deleteRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('frontdesk', 'manager'), getRooms)
  .post(protect, authorize('manager'), createRoom);

router.route('/:id/status')
  .put(protect, authorize('frontdesk', 'housekeeping', 'maintenance', 'manager'), updateRoomStatus);

router.route('/:id')
  .delete(protect, authorize('manager'), deleteRoom);

module.exports = router;
