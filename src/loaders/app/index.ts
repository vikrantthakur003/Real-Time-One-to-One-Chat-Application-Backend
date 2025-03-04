import { createServer, Server } from 'http';
import express, { Express } from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO
import { makeResponse } from '../../lib';

const PORT = Number(process.env.PORT) || 3000;
const HOST: string = String(process.env.HOST || '0.0.0.0');

export const appLoader = async (app: Express, router: any) => new Promise<any>(resolve => {
  const server: Server = createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // User comes online
    socket.on('user_online', (userId) => {      
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ID: ${socket.id}`);
    });
    
    // Handle private messages
    socket.on('private_message', async (data) => {
      const { to, message, from } = data;
      const receiverSocketId = onlineUsers.get(to);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          from,
          message,
          timestamp: new Date()
        });
      }
    });
    
    // Mark messages as read
    socket.on('mark_messages_read', (data) => {
      const { from, to } = data;
      const receiverSocketId = onlineUsers.get(from);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('messages_read', { by: to });
      }
    });
    
    // User disconnects
    socket.on('disconnect', () => {
      let disconnectedUserId = null;
      
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }
      
      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        console.log(`User ${disconnectedUserId} disconnected`);
      }
    });
  });

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json({
    limit: '10mb'
  }));
  app.use(express.urlencoded({
    extended: true
  }));

  app.use('/api', router);

  app.use(async (req, res) => {
    await makeResponse(res, 404, false, 'the resource you are looking for is not found', undefined);
  });
  server.listen(PORT, HOST, () => {
    console.log('App is running on port: ', PORT);
    resolve(true);
  });
});