module.exports = (container) => {
  const notificationController = require('./notificationController')(container)
  const fcmtokenController = require('./fcmtokenController')(container)
  const readController = require('./readController')(container)
  const cdcController = require('./cdcController')(container)
  return { notificationController, readController, fcmtokenController, cdcController }
}
