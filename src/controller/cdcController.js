
module.exports = (container) => {
  const logger = container.resolve('logger')
  const ObjectId = container.resolve('ObjectId')
  const {
    schemaValidator,
    schemas: {
      Fcmtoken
    }
  } = container.resolve('models')
  const { httpCode, serverHelper } = container.resolve('config')
  const { fcmtokenRepo, notificationRepo } = container.resolve('repo')
  const addFcmtoken = async (req, res) => {
    try {
      const thoauoc = req.body
      const {
        error,
        value
      } = await schemaValidator(thoauoc, 'Fcmtoken')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      const sp = await fcmtokenRepo.addFcmtoken(value)
      res.status(httpCode.CREATED).send(sp)
    } catch (e) {
      logger.e(e)
      if (e.code && e.code === 11000) return res.status(httpCode.CREATED).send({})
      res.status(httpCode.UNKNOWN_ERROR).end()
    }
  }
  const deleteFcmtoken = async (req, res) => {
    try {
      const { fcmToken } = req.body
      if (fcmToken) {
        await fcmtokenRepo.removeFcmtoken({ fcmToken })
        res.status(httpCode.SUCCESS).send({ ok: true })
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateFcmtoken = async (req, res) => {
    try {
      const { id } = req.params
      const fcmtoken = req.body
      const {
        error,
        value
      } = await schemaValidator(fcmtoken, 'Fcmtoken')
      if (error) {
        return res.status(httpCode.BAD_REQUEST).send({ msg: error.message })
      }
      if (id && fcmtoken) {
        const sp = await fcmtokenRepo.updateFcmtoken(id, value)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  const updateNotification = async (req, res) => {
    try {
      const { id } = req.params
      const notification = req.body
      if (id && notification) {
        const sp = await notificationRepo.updateNotification(id, notification)
        res.status(httpCode.SUCCESS).send(sp)
      } else {
        res.status(httpCode.BAD_REQUEST).end()
      }
    } catch (e) {
      logger.e(e)
      res.status(httpCode.UNKNOWN_ERROR).send({ ok: false })
    }
  }
  return {
    addFcmtoken,
    updateFcmtoken,
    deleteFcmtoken,
    updateNotification
  }
}
