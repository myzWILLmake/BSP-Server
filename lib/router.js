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
            avatar: person.avatar
          }
        })
      }
      res.end()
    }
    dbc.findUserById(req.body, callback);
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
