var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/BSP')

var db = mongoose
var schema = {
  User: {
    mail:{
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    nickname: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      require: true
    },
    avatar: String,
    desc: String,
    friends: [],
    unread: {}
  },

  Message: {
    time: {
      type: Date,
      require: true
    },
    from: {
      type: db.Schema.ObjectId,
      ref: 'user',
      require: true
    },
    to: {
      type: db.Schema.ObjectId,
      ref: 'user',
      require: true
    },
    content: String
  }
}

module.exports = {
  getDb: function() {
    return db
  },
  getSchema: function(name) {
    return new db.Schema(schema[name])
  },
  getModel: function(name) {
    return db.model(name, schema[name])
  },
  getObjectId: function(_id) {
    return db.Types.ObjectId(_id)
  }
}
