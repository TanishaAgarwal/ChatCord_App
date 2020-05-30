const path = require('path');
const express  = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder 
app.use(express.static(path.join(__dirname, 'public')))

//Runs when client connect
io.on('connection', socket => {
  console.log("New web socket connection!!")
  // When new user enters..
  socket.emit('message', "Welcome to Chat-Cord!!");
  
  // boardcast to all othr user of group !!
  socket.broadcast.emit('message', 'A user has joined the chat.');

  // When the user is disconnected
  socket.on('disconnect', ()=>{
    io.emit('message', 'A  user has left the chat.')
  })

  // Listen to chatMessage
  socket.on('chatMessage', msg=>{
    io.emit('message', msg);
  })
})

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});