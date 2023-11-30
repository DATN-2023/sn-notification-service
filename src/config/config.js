const serverSettings = {
  port: process.env.PORT || 8008,
  basePath: process.env.BASE_PATH || ''
}

const httpCode = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  TOKEN_EXPIRED: 409,
  UNKNOWN_ERROR: 520,
  FORBIDDEN: 403,
  ADMIN_REQUIRE: 406
}

const dbSettings = {
  db: process.env.DB || 'hddt-customer',
  user: process.env.DB_USER || '',
  pass: process.env.DB_PASS || '',
  repl: process.env.DB_REPLS || '',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(',') : [
    'localhost:27017'
  ]
}
const serverHelper = function () {
  const jwt = require('jsonwebtoken')
  const crypto = require('crypto')
  const secretKey = process.env.SECRET_KEY || '112customer#$!@!'

  function decodeToken (token) {
    return jwt.decode(token)
  }

  function genToken (obj) {
    return jwt.sign(obj, secretKey, { expiresIn: '1d' })
  }

  function verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        err ? reject(new Error(err)) : resolve(decoded)
      })
    })
  }

  function encryptPassword (password) {
    return crypto.createHash('sha256').update(password, 'binary').digest('base64')
  }

  return { decodeToken, encryptPassword, verifyToken, genToken }
}
const rabbitConfig = {
  host: process.env.RABBIT_HOST || 'localhost',
  port: process.env.RABBIT_PORT || 5672,
  user: process.env.RABBIT_USER || 'wilad',
  pass: process.env.RABBIT_PASS || 'wilad0304'
}
const workerConfig = {
  queueName: process.env.QUEUE_NAME || 'sn.notification',
  exchange: process.env.EXCHANGE || 'sn:notification',
  exchangeType: process.env.EXCHANGE_TYPE || 'direct'
}
const DEFAULT_GOOGLE_APPLICATION_CREDENTIALS = require.resolve('./test-1a4cc-firebase-adminsdk-zwpu2-f6fd29771f.json')
const firebaseConfig = {
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://carplaplus-bcc-d6235.asia-southeast1.firebasedatabase.app',
  serviceAccountPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_GOOGLE_APPLICATION_CREDENTIALS
}
module.exports = { dbSettings, serverHelper: serverHelper(), serverSettings, httpCode, rabbitConfig, workerConfig, firebaseConfig }
