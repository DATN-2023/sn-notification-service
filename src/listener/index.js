module.exports = container => {
  const subscriber = container.resolve('subscriber')
  const logger = container.resolve('logger')
  const mediator = container.resolve('mediator')
  const firebaseAdmin = container.resolve('firebaseAdmin')
  const { notificationRepo } = container.resolve('repo')
  const {
    schemaValidator,
    schemas: {
      Notification
    }
  } = container.resolve('models')
  const { typeConfig } = Notification.getConfig()
  const jobs = []
  const EVENT_NAME = 'nextjob'
  mediator.on(EVENT_NAME, async () => {
    if (jobs.length) {
      const msg = jobs.shift()
      await handle(msg)
    }
  })

  subscriber.on('message', async msg => {
    logger.d('newMessage', new Date())
    // await handle(msg)
    jobs.push(msg)
    setTimeout(() => {
      mediator.emit(EVENT_NAME, '')
    }, 500)
  })

  const handleMessageNoti = (message) => {
    const fcmToken = 'c9tDdXNafLCtdcPH8in5H8:APA91bHU15AoFTnnwIQFBUrZWTMDi1tdj2H1icDKJLSQUYvwJkRbnIK3tyamqULTCqBa6SSmXDHpj4jHqwIYJ_Dg1EIV3s_WcGeM_cw0Qg2nXJC4BQs006FN7yfk6k3gZ8NveFnbQ-1Y'
    switch (message.type) {
      case typeConfig.COMMENT:
        const payload = {
          token: fcmToken || '',
          notification: {
            title: `Thông báo từ EGOSNET`,
            body: `Bình luận về bài viết của bạn`
          }
          // data: {
          //   targetId: `${message.targetId}`,
          //   type: `${message.type}`
          // }
        }
        return payload
      default:
        return
    }
  }

  const handleMessage = async (message) => {
    const {
      error,
      value
    } = await schemaValidator(message, 'Notification')
    if (error) {
      logger.e(error)
    }
    const notification = await notificationRepo.addNotification(value)
    const payload = handleMessageNoti(notification)
    await pushFcm(payload)
  }

  const pushBatchFcm = async (messages) => {
    return firebaseAdmin.messaging().sendEach(messages)
  }
  const pushFcm = async (message) => {
    return firebaseAdmin.messaging().send(message)
  }

  const handle = async (msg) => {
    try {
      const message = JSON.parse(msg.content.toString('utf8'))
      logger.d('message: ', message)
      await handleMessage(message)
      subscriber.ack(msg)
      setTimeout(() => {
        mediator.emit(EVENT_NAME, '')
      }, 500)
    } catch (e) {
      logger.e(e)
      jobs.push(msg)
      setTimeout(() => {
        mediator.emit(EVENT_NAME, '')
      }, 500)
    }
  }
}