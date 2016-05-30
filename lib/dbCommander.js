var dbTools = require('./dbTools')

var UserModel = dbTools.getModel('User')
var MessageModel = dbTools.getModel('Message')

module.exports = {
  findUserByMail: function(obj, callback) {
    UserModel.findOne({mail: obj.mail}, callback)
  },
  findUserById: function(obj, callback) {
    UserModel.findOne({_id: obj._id}, callback)
  },
  createUser: function(obj, callback) {
    var newUser = {
      mail: obj.mail,
      password: obj.password,
      nickname: obj.nickname,
      phone: obj.phone,
      avatar: obj.avatar,
      friends: [],
      unread: new Object()
    }
    UserModel.create(newUser, callback)
  },
  updateUnread: function(obj, callback) {
    var message = {
      time: obj.time,
      from: dbTools.getObjectId(obj.from),
      to: dbTools.getObjectId(obj.to),
      content: obj.content
    }
    UserModel.findById(message.to, function(err, doc){
      if (err) {
        callback('ERROR: Wrong _id')
        return
      }
      var user = doc.toObject()
      user.unread[message.from] = message
      delete user._id
      UserModel.update({_id: message.to}, user, callback)
    })
  },
  emptyUnread: function(obj, callback) {
    var _id = obj._id
    UserModel.findById(_id, function(err, doc){
      if (err) {
        callback('ERROR: Wrong _id')
        return
      }
      var user = doc.toObject()
      user.unread = new Object()
      delete user._id
      UserModel.update({_id: _id}, user, callback)
    })
  },
  createMessage: function(obj, callback) {
    var newMessage = {
      time: obj.time,
      from: dbTools.getObjectId(obj.from),
      to: dbTools.getObjectId(obj.to),
      content: obj.content
    }
    MessageModel.create(newMessage, callback)
  },
  findRecentMessages: function(obj, callback) {
    var user_id = dbTools.getObjectId(obj.user_id)
    var person_id = dbTools.getObjectId(obj.person_id)
    MessageModel.find({
      $or:[
        {from: user_id, to: person_id},
        {from: person_id, to: user_id}
      ]
    }, null, {
      limit: 10,
      sort: {time: -1}
    }, callback)
  }

}
