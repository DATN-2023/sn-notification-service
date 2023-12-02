module.exports = container => {
  const subscriber = container.resolve('subscriber')
  const logger = container.resolve('logger')
  const mediator = container.resolve('mediator')
  const firebaseAdmin = container.resolve('firebaseAdmin')
  const ObjectId = container.resolve('ObjectId')
  const {
    notificationRepo,
    fcmtokenRepo
  } = container.resolve('repo')
  const { userHelper } = container.resolve('helper')
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

  const handleMessageNoti = (message, user) => {
    return {
      notification: {
        title: `Thông báo từ EGOSNET`,
        body: `${user.name} ${message.content}`
      },
      data: {
        user: JSON.stringify(user?.data),
        feed: message.feed.toString(),
        comment: message.feed.toString(),
        type: message.type.toString()
      }
    }
  }

  const handleContent = (message) => {
    switch (message.type) {
      case typeConfig.COMMENT:
        return 'đã bình luận về bài viết của bạn'
      case typeConfig.REACT:
        return 'đã bày tỏ cảm xúc về bài viết của bạn'
      case typeConfig.FOLLOW:
        return 'đã yêu cầu theo dõi bạn'
      default:
        return
    }
  }

  const handleRemoveMessage = async (message) => {
    if (message.type === typeConfig.UNREACT) {
      await notificationRepo.removeNotification({ reaction: new ObjectId(message.reaction) })
    } else if (message.type === typeConfig.UNFOLLOW) {
      await notificationRepo.removeNotification({
        user: new ObjectId(message.user),
        alertUser: new ObjectId(message.alertUser),
        type: typeConfig.FOLLOW
      })
    }
  }

  const handleMessage = async (message) => {
    const content = handleContent(message)
    if (!content) {
      await handleRemoveMessage(message)
      return
    }
    message.content = content
    const {
      error,
      value
    } = await schemaValidator(message, 'Notification')
    if (error) {
      logger.e(error)
    }
    const notification = await notificationRepo.addNotification(value)
    const data = await userHelper.getUser({ ids: message.user.toString() })
    const fcmTokenData = await fcmtokenRepo.getFcmtokenNoPaging({ user: new ObjectId(message.alertUser) })
    const payload = handleMessageNoti(notification, data)
    const messages = fcmTokenData.map(data => pushFcm({
      ...payload,
      token: data.fcmToken
    }).then(values => true).catch(error => false))
    const results = await Promise.all(messages)
    for (const index in results) {
      if (!results[index]) await fcmtokenRepo.deleteFcmtoken(fcmTokenData[index]._id.toString())
    }
    logger.d('results', notification._id.toString(), results)
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
