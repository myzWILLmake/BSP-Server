var dbc = require('./dbCommander')

var rules = function(app) {
  app.use(function(req, res, next) {
    console.log('Conection established from: ', req.ip, ' at ', Date.now())
    console.log(req.path)
    next()
  })

  app.post('/register', function (req, res){
    var callback = function(err, doc) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        res.json({
          succ: true,
          data: doc
        })
      }
      res.end()
    }
    dbc.createUser(req.body, callback)
  })

  app.post('/modify', function(req, res) {
    var callback = function(err, doc) {
      if (err) {
        res.json({
          succ: false,
          data: err
        })
      } else {
        res.json({
          succ: true,
          data: doc
        })
      }
      res.end()
    }
    dbc.updateUser(req.body, callback)
  })

  app.post('/user', function(req, res) {
    var callback = function(err, doc) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        var user = doc.toObject()
        res.json({
          succ: true,
          data: user
        })
      }
      res.end()
    }
    dbc.findUserById(req.body, callback)
  })

  app.post('/auth', function (req, res) {
    var callback = function(err, doc) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        if (doc == null) {
          res.json({
            succ: false,
            error: "账户不存在"
          })
        } else {
          var user = doc.toObject()
          var password = req.body.password
          if (password === user.password) {
            req.session.logged = true
            res.json({
              succ: true,
              data: user
            })
          } else {
            res.json({
              succ: false,
              error: "密码错误"
            })
          }
        }
      }
      res.end()
    }
    dbc.findUserByMail(req.body, callback)
  })

  app.post('/person', function(req, res) {
    var callback = function(err, doc) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        var person = doc.toObject()
        res.json({
          succ: true,
          data: {
            _id: person._id,
            nickname: person.nickname,
            phone: person.phone,
            avatar: person.avatar,
            desc: person.desc
          }
        })
      }
      res.end()
    }
    dbc.findUserById(req.body, callback);
  })

  app.post('/person/nickname', function(req, res) {
    var callback = function(err, docs) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        var people = []
        for (var i in docs) {
          var person = docs[i].toObject()
          people.push({
            _id: person._id,
            nickname: person.nickname,
            desc: person.desc,
            avatar: person.avatar
          })
        }
        res.json({
          succ: true,
          data: people
        })
      }
      res.end()
    }
    dbc.getPeopleByNickname(req.body, callback)
  })

  app.post('/person/friend', function(req, res) {
    var callback = function(err) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        res.json({
          succ: true,
          error: err
        })
      }
      res.end()
    }
    dbc.addFriendRequest(req.body, callback)
  })

  app.post('/person/friend/accept', function(req, res) {
    var callback = function(err) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        res.json({
          succ: true,
          error: err
        })
      }
      res.end()
    }
    dbc.acceptFriendRequest(req.body, callback)
  })

  app.post('/person/friend/refuse', function(req, res) {
    var callback = function(err) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        res.json({
          succ: true,
          error: err
        })
      }
      res.end()
    }
    dbc.refuseFriendRequest(req.body, callback)
  })

  app.post('/message', function(req, res) {
    var callback = function(err, docs) {
      if (err) {
        res.json({
          succ: false,
          error: err
        })
      } else {
        var messages = []
        for (var i in docs) {
          messages.push(docs[i].toObject())
        }
        res.json({
          succ: true,
          data: messages
        })
      }
      res.end()
    }
    dbc.findRecentMessages(req.body, callback)
  })


}

module.exports.run = rules
