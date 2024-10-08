import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Notification } from './models/notification';

export function setupWebSocket(server: HttpServer): Server {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (userId) => {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      console.log(`User ${userId} joined room ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });

    socket.on('notification', (message) => {
      console.log('Received notification:', message);
    });
  });

  return io;
}

//function to send notifications to specific users
export async function sendNotification(
  io: Server,
  userId: number,
  message: string
) {
  const roomName = `user_${userId}`;
  if (io) {
    io.to(roomName).emit('notification', message);
    console.log('emitted notification to room user_${userId}');
    // store notification in database
    await Notification.query().insert({
      userId,
      message,
      isRead: false,
      createdAt: new Date(),
    });

    console.log('added notification to storage');
  } else {
    console.error('IO object is null or undefined');
  }
}
