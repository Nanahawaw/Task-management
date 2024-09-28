const io = require('socket.io-client');

// Replace with your server's URL and port
const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log('Connected to server');

    // Join a user room (replace 123 with an actual user ID)
    socket.emit('join', 1);
    console.log('Joined user room for user 1');
});

socket.on('notification', (message) => {
    console.log('Received notification:', message);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Keep the script running
setInterval(() => { }, 1000);