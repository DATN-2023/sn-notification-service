const repo = (container) => {
  const notificationRepo = require('./notificationRepo')(container)
  return { notificationRepo }
}
const connect = (container) => {
  const dbPool = container.resolve('db')
  if (!dbPool) throw new Error('Connect DB failed')
  return repo(container)
}

module.exports = { connect }
