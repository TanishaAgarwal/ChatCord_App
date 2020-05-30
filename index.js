const app  = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         console.log('chat msg : ', (msg));
//   });
// });

// io.on('connection', (socket) => {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', (data) => {
//     console.log(data);
//   });
// });

// const io = require('socket.io')(80);
const chat = io
  .of('/chat')
  .on('connection', (socket) => {
    socket.emit('a message', {
        that: 'only'
      , '/chat': 'will get'
    });
    chat.emit('a message', {
        everyone: 'in'
      , '/chat': 'will get'
    });
  });

const news = io
  .of('/news')
  .on('connection', (socket) => {
    socket.emit('item', { news: 'item' });
  });

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});