module.exports = (container) => {
  const notificationController = require('./notificationController')(container)
  return { notificationController }
}
