module.exports = container => {
  const subscriber = container.resolve('subscriber')
  const logger = container.resolve('logger')
  const mediator = container.resolve('mediator')
  const {
    schemaValidator
  } = container.resolve('models')
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

  const handle = async (msg) => {
    try {
      const message = JSON.parse(msg.content.toString('utf8'))
      logger.d('message: ', message)
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