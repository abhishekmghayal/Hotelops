const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats')
  .get(protect, getStats);

module.exports = router;
