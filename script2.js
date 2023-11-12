const socket = io('http://192.168.62.118:8080/');
const peer = new Peer(undefined, {
    host: '192.168.62.118',
    port: 8080
});

// const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

const usernameInput = document.querySelector('#username');
const roomInput = document.querySelector('#room');
const hostButton = document.querySelector('#host');
const joinButton = document.querySelector('#join');
const videosDiv = document.querySelector('#videos');
const hostVideo = document.querySelector('#hostVideo');

let myPeer = null;

peer.on('open', async (peerId) => {
    myPeer = peerId;
    socket.emit('registerPeer', peerId);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    hostVideo.srcObject = stream;
});



hostButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('room:create', usernameInput.value);
});

socket.on('room:created', (roomId) => {
    alert(`The room is created successfully => ${roomId}`);
});

joinButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('room:join', roomInput.value, usernameInput.value);
});

socket.on('room:ask:join', (userId, roomId, userInfo) => {
    const result = window.confirm(`${userInfo.username} Asks to join to room`);
    if (result) {
        socket.emit('room:allow:join', userId, roomId);
    } else {
        socket.emit('room:deny:join', userId, roomId);
    }
});

socket.on('room:joined', async (userId, roomId, userInfo) => {
    console.log(`${userInfo.username} Joined into room!`);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const call = peer.call(userInfo.peerId, stream);
    const rev = document.createElement('video');
    videosDiv.appendChild(rev);
    call.on("stream", (remoteStream) => {
        rev.srcObject = remoteStream;
        rev.play();
    });
});

peer.on('call', async (call) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const rev = document.createElement('video');
    videosDiv.appendChild(rev);
    call.answer(stream);
    call.on("stream", (remoteStream) => {
        rev.srcObject = remoteStream;
        rev.play();
    });
});

socket.on('room:denyed', (roomId) => {
    alert(`Your request has been rejected (${roomId})!`);
});