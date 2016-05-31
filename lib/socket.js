var io = require('socket.io')
var dbc = require('./dbCommander')

var onlineMap = []

module.exports.run = function(server) {

  socketServer = io(server)

  socketServer.on('connection', function(socket) {

    socket.on('log', function(data) {
      onlineMap[data._id] = true
      socket._id = data._id
      socket.join(data._id)
      console.log('socket: ', socket._id)
      for (var i in socket.rooms) {
        console.log('room[', i, ']', socket.rooms[i])
      }
      dbc.emptyUnread(data, function(err) {console.log(err)})
    })

    socket.on('send message', function(data) {
      var message = data
      if (onlineMap[message.to] === true) {
        socket.to(message.to).emit('new message', message)
      } else {
        dbc.updateUnread(message, function(err) {console.log(err)})
      }
      dbc.createMessage(message, function(err) {console.log(err)})
    })

    socket.on('disconnect', function() {
      if (socket._id !== undefined)
        onlineMap[socket._id] = false
    })
  })

}
