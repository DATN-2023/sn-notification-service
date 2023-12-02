const { initDI } = require('./di')
const { name } = require('../package.json')
const config = require('./config')
const logger = require('./logger')
const middleware = require('./middleware')
const server = require('./server')
const models = require('./models')
const controller = require('./controller')
const { connect } = require('./database')
const repo = require('./repo')
const listener = require('./listener')
const helper = require('./helper')
const {
  Subscriber,
  createChannel
} = require('./queue')
const firebaseAdmin = require('firebase-admin')
const EventEmitter = require('events').EventEmitter
const mediator = new EventEmitter()
logger.d(`${name} Service`)
mediator.once('di.ready', container => {
  console.log('di.ready, starting connect db ', config.dbSettings)
  container.registerValue('config', config)
  container.registerValue('middleware', middleware)
  container.registerValue('logger', logger)
  container.registerValue('mediator', mediator)
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(config.firebaseConfig.serviceAccountPath),
    databaseURL: config.firebaseConfig.databaseURL
  })
  container.registerValue('firebaseAdmin', firebaseAdmin)
  mediator.once('db.ready', async db => {
    const channel = await createChannel(config.rabbitConfig)
    const subscriber = new Subscriber(channel, config.workerConfig.queueName, config.workerConfig.exchange, config.workerConfig.exchangeType)
    container.registerValue('subscriber', subscriber)
    logger.d('db.ready, starting server')
    container.registerValue('helper', helper(container))
    container.registerValue('db', db)
    container.registerValue('models', models(container))
    const repository = repo.connect(container)
    container.registerValue('repo', repository)
    container.registerValue('controller', controller(container))
    container.registerValue('middleware', middleware(container))
    server.start(container).then(app => {
      logger.d('Server started at port ', app.address().port)
    })
    listener(container)
  })
  connect(container, mediator)
})
initDI(mediator)
