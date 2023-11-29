module.exports = container => {
  const { schemas } = container.resolve('models')
  const { Notification } = schemas
  const addNotification = (cate) => {
    const c = new Notification(cate)
    return c.save()
  }
  const getNotificationById = (id) => {
    return Notification.findById(id)
  }
  const deleteNotification = (id) => {
    return Notification.findByIdAndRemove(id, { useFindAndModify: false })
  }
  const updateNotification = (id, n) => {
    return Notification.findByIdAndUpdate(id, n, {
      useFindAndModify: false,
      returnOriginal: false
    })
  }
  const checkIdExist = (id) => {
    return Notification.findOne({ id })
  }
  const getCount = (pipe = {}) => {
    return Notification.countDocuments(pipe)
  }
  const getNotificationAgg = (pipe) => {
    return Notification.aggregate(pipe)
  }
  const getNotification = (pipe, limit, skip, sort) => {
    return Notification.find(pipe).limit(limit).skip(skip).sort(sort)
  }
  const getNotificationNoPaging = (pipe) => {
    return Notification.find(pipe)
  }
  const removeNotification = (pipe) => {
    return Notification.deleteMany(pipe)
  }
  return {
    getNotificationNoPaging,
    removeNotification,
    addNotification,
    getNotificationAgg,
    getNotificationById,
    deleteNotification,
    updateNotification,
    checkIdExist,
    getCount,
    getNotification
  }
}
