const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get user name and room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
const socket = io();

//JOin chat room

socket.emit('joinRoom', {username, room})

//get rooms and users
socket.on('roomUsers', ({room , users}) => {
    outputRoomName(room);
    outputUsers(users);
})

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get msg text
    const msg = e.target.elements.msg.value;


    // emit the msg to server
    socket.emit("chatMessage",msg);

    //Clear input view
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output message to DOM

function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${msg.username} <span> ${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>
    `;

    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}