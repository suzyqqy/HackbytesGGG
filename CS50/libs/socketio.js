let name = localStorage.getItem('name');
if(!name) {
    name = prompt("What is your name?")
    localStorage.setItem('name', name);
}


// REGISTER COMMUNICATIONS
const socket = io('/tunnel');
async function initializeSockets() {
    const res = await fetch('/tunnel/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            events: ['chat']
        })
    });
    
    const resp = await res.json();

    if(resp.error) return alert(resp.error)
    

    socket.on('chatresponse', function(data) {
        const div = document.createElement('div');
        div.className = 'you';
        div.innerHTML = `<b>${data.data.name}:</b> <span>${data.data.text}</span>`;
        $main.appendChild(div);
        $main.scrollTo(0,$main.scrollHeight);
    });
    
    socket.on('userconnected', (socketId) => {
        console.log('userconnected: ' + socketId);
    });
    
    socket.on('userdisconnected', (socketId) => {
        console.log('disconnected: ' + socketId);
    })

}
initializeSockets();

// SENDING CHAT MESSAGE
const $button = document.querySelector('button');
const $textarea = document.querySelector('textarea');
const $main = document.querySelector('main');

function sendMessage() {
    socket.emit('chat', {name, text: $textarea.value});
    
    const div = document.createElement('div');
    div.className = 'me';
    div.innerHTML = `<b>${name}:</b> <span>${$textarea.value}</span>`;
    $main.appendChild(div);
    $textarea.value = '';
    $main.scrollTo(0,$main.scrollHeight);
}

$button.addEventListener('click', sendMessage);
$textarea.focus();