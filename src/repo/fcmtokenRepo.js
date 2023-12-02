module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Fcmtoken } = schemas
  const addFcmtoken = (cate) => {
    const c = new Fcmtoken(cate)
    return c.save()
  }
  const getFcmtokenById = (id) => {
    return Fcmtoken.findById(id)
  }
  const deleteFcmtoken = (id) => {
    return Fcmtoken.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateFcmtoken = (id, n) => {
    return Fcmtoken.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Fcmtoken.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Fcmtoken.countDocuments(pipe)
  }
  const getFcmtokenAgg = (pipe) => {
    return Fcmtoken.aggregate(pipe)
  }
  const getFcmtoken = (pipe, limit, skip, sort) => {
    return Fcmtoken.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getFcmtokenNoPaging = (pipe) => {
    return Fcmtoken.find(pipe).lean()
  }
  const removeFcmtoken = (pipe) => {
    return Fcmtoken.deleteMany(pipe)
  }
  return {
    getFcmtokenNoPaging,
    removeFcmtoken,
    addFcmtoken,
    getFcmtokenAgg,
    getFcmtokenById,
    deleteFcmtoken,
    updateFcmtoken,
    checkIdExist,
    getCount,
    getFcmtoken
  }
}
