const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicketStatus, assignTicket, deleteTicket } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTickets)
  .post(protect, authorize('frontdesk', 'maintenance', 'manager'), createTicket);

router.route('/:id/status')
  .put(protect, authorize('maintenance', 'manager'), updateTicketStatus);

router.route('/:id/assign')
  .put(protect, authorize('maintenance', 'manager'), assignTicket);

router.route('/:id')
  .delete(protect, authorize('manager'), deleteTicket);

module.exports = router;
