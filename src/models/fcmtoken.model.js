module.exports = (joi, mongoose, { joi2MongoSchema, schemas }) => {
  const { ObjectId } = mongoose.Types
  const firebaseUserJoi = joi.object({
    user: joi.number().required(),
    fcmToken: joi.string().required(),
  })
  const firebaseUserSchema = joi2MongoSchema(firebaseUserJoi, {
    userId: {
      index: true,
      type: ObjectId
    },
    fcmToken: {
      index: true,
      unique: true
    }
  }, {
    createdAt: {
      type: Number,
      default: () => Math.floor(Date.now() / 1000)
    }
  })
  firebaseUserSchema.statics.validateObj = (obj, config = {}) => {
    return firebaseUserJoi.validate(obj, config)
  }
  firebaseUserSchema.statics.validateTaiLieu = (obj, config = {
    allowUnknown: true,
    stripUnknown: true
  }) => {
    return firebaseUserJoi.validate(obj, config)
  }
  const firebaseUserModel = mongoose.model('FirebaseUser', firebaseUserSchema)
  firebaseUserModel.syncIndexes()
  return firebaseUserModel
}
