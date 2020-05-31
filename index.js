const path = require('path');
const express  = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')
// Set static folder 
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'Chat-Cord';

//Runs when client connect
io.on('connection', socket => {
  socket.on('joinRoom', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // When new user enters..
    socket.emit('info', formatMessage(botName, "Welcome to Chat-Cord!!"));
      
    // boardcast to all othr user of group !!
    socket.broadcast.to(user.room).emit('info', formatMessage(botName, `${username} has joined the chat.`));

    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    })

  });


  // Listen to chatMessage
  socket.on('chatMessage', msg=>{
    const user = getCurrentUser(socket.id)
    socket.broadcast.to(user.room).emit('recieve', formatMessage( user.username ,msg));
    socket.emit('send', formatMessage(user.username,msg));

  })

  // When the user is disconnected
socket.on('disconnect', ()=>{
  const user = userLeave(socket.id);
  if(user){
    io.to(user.room).emit('info', formatMessage(botName, `${user.username} has left the chat.`))
    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    })

  }

})
})

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});