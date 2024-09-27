import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setupWebSocket(server: HttpServer): Server {
  const io = new Server(server);

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
export function sendNotification(io: Server, userId: number, message: string) {
  if (io) {
    io.to(`user_${userId}`).emit('notification', message);
  }
}
