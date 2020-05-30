const chatForm = document.getElementById('chat-form');
const socket = io();

//Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get msg text
    const msg = e.target.elements.msg.value;


    // emit the msg to server
    socket.emit("chatMessage",msg);
})

//output message to DOM

function outputMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">Mary <span>9:15pm</span></p>
        <p class="text">
            ${msg}
        </p>
    `;

    document.querySelector('.chat-messages').appendChild(div)
}