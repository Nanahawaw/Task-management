"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
exports.sendNotification = sendNotification;
const socket_io_1 = require("socket.io");
function setupWebSocket(server) {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('join', (userId) => {
            socket.join(`user_${userId}`);
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return io;
}
//function to send notifications to specific users
function sendNotification(io, userId, message) {
    if (io) {
        io.to(`user_${userId}`).emit('notification', message);
    }
}
