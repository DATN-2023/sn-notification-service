const repo = (container) => {
  const notificationRepo = require('./notificationRepo')(container)
  const fcmtokenRepo = require('./fcmtokenRepo')(container)
  return { notificationRepo, fcmtokenRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
