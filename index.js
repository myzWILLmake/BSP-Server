var express = require('express')

var session = require('express-session')
var bodyParser = require('body-parser')
var MongoStore = require('connect-mongo')(session)

var router = require('./lib/router')

var app = express()
app.listen(9001)

var server = require('http').Server(app)
server.listen(9000)

var socketServer = require('./lib/socket')
socketServer.run(server)

console.log('Listening on port 9001...')

app.use(session({
    secret: 'Akagi.moe',
    store: new MongoStore({
        url: 'mongodb://localhost/BSP',
        ttl: 1 * 24 * 60 * 60
    }),
}))

app.use(express.static('public'))
app.use(bodyParser.json())

router.run(app)
