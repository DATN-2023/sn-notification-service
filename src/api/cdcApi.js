module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { cdcController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.put(`${basePath}/cdc/fcmtokens/:id`, cdcController.updateFcmtoken)
  app.delete(`${basePath}/cdc/fcmtokens`, cdcController.deleteFcmtoken)
  app.post(`${basePath}/cdc/fcmtokens`, cdcController.addFcmtoken)

  app.put(`${basePath}/cdc/notifications/:id`, cdcController.updateNotification)
}
