const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: 'cloud env',
  traceUser: true,
})
exports.main = async (event, context) => {
  return db.collection('broadcast')
  .where({
    hour: event.hour,
  })
  .get()
  
}