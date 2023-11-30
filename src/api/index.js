module.exports = (app, container) => {
  require('./sdpApi')(app, container)
  require('./cdcApi')(app, container)
  require('./notificationApi')(app, container)
  require('./fcmtokenApi')(app, container)
}
