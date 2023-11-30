module.exports = (app, container) => {
  const { serverSettings } = container.resolve('config')
  const { fcmtokenController } = container.resolve('controller')
  const { basePath } = serverSettings
  app.get(`${basePath}/fcmtokens`, fcmtokenController.getFcmtoken)
  app.get(`${basePath}/fcmtokens/:id`, fcmtokenController.getFcmtokenById)
  app.put(`${basePath}/fcmtokens/:id`, fcmtokenController.updateFcmtoken)
  app.delete(`${basePath}/fcmtokens/:id`, fcmtokenController.deleteFcmtoken)
  app.post(`${basePath}/fcmtokens`, fcmtokenController.addFcmtoken)
}
