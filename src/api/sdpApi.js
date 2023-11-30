module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { readController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/sdp/notifications`, readController.getNotification)
  app.get(`${basePath}/sdp/notifications/:id`, readController.getNotificationById)
}
