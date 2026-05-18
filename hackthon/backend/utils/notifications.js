const Notification = require('../models/Notification');
const { emitEvent } = require('./realtime');

const createNotification = async ({ user = null, message }) => {
  const notification = await Notification.create({ user, message });
  const populated = await notification.populate('user', 'name email role');
  emitEvent('notificationSent', populated);
  return populated;
};

module.exports = createNotification;
