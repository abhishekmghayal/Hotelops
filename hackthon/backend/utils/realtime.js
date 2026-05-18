let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const emitEvent = (event, payload = {}) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};

const emitDashboardUpdated = () => emitEvent('dashboardUpdated', { at: new Date().toISOString() });

module.exports = {
  setIO,
  emitEvent,
  emitDashboardUpdated
};
