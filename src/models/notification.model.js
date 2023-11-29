module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const typeConfig = {
    COMMENT: 1,
    REACT: 2,
    POST: 3,
    SHARE: 4,
    FOLLOW: 5
  }
  const notificationJoi = joi.object({
    user: joi.string().required(),
    alertUser: joi.string().required(),
    type: joi.number().valid(...typeConfig.values).required(),
    endpoint: joi.string().required(),
    hasRead: joi.number().valid(0, 1).default(0),
    content: joi.string().required(),
    feed: joi.string().default('').allow(''),
    comment: joi.string().default('').allow('')
  })
  const notificationSchema = joi2MongoSchema(notificationJoi, {
    user: {
      type: ObjectId
    },
    alertUser: {
      type: ObjectId
    },
    feed: {
      type: ObjectId
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  notificationSchema.statics.validateObj = (obj, config = {}) => {
    return notificationJoi.validate(obj, config)
  }
  notificationSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return notificationJoi.validate(obj, config)
  }
  const notificationModel = mongoose.model('Notification', notificationSchema)
  notificationModel.syncIndexes()
  return notificationModel
}
