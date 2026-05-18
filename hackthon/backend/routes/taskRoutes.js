const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus, assignTask, uploadProof, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('frontdesk', 'manager'), createTask);

router.route('/:id/status')
  .put(protect, authorize('housekeeping', 'frontdesk', 'manager'), updateTaskStatus);

router.route('/:id/assign')
  .put(protect, authorize('frontdesk', 'manager'), assignTask);

router.route('/:id/upload-proof')
  .post(protect, authorize('housekeeping', 'manager'), upload.single('image'), uploadProof);

router.route('/:id')
  .delete(protect, authorize('manager'), deleteTask);

module.exports = router;
