import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

import { Types } from 'mongoose';
import { IMessage } from '../Message/message.interface';
import { MessageService } from '../Message/message.service';
import { ChatRoomService } from '../ChatRoom/chatRoom.service';

interface IUserSocket extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>(); // userId => socketId

export const setupSocketIO = (io: Server) => {
  io.use((socket: IUserSocket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Auth token missing'));

      const decoded = jwt.verify(token, config.jwt_access_secret as string) as { _id: string };
      socket.userId = decoded._id;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: IUserSocket) => {
    if (!socket.userId) return socket.disconnect();

    console.log(`User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);
    socket.join(socket.userId);
    io.emit('online_users', Array.from(onlineUsers.keys()));

    socket.on('private_message', async (msg: IMessage) => {
      try {
        const messageToStore: IMessage = {
          senderId: new Types.ObjectId(socket.userId!),
          receiverId: new Types.ObjectId(msg.receiverId),
          content: msg.content,
          roomId: msg.roomId,
          isRead: false,
          createdAt: new Date(),
        };

        const newMsg = await MessageService.createMessage(messageToStore);

        const receiverSocketId = onlineUsers.get(msg.receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', newMsg);
        }

                await ChatRoomService.createOrUpdateChatRoom({
          roomId: msg.roomId,
          members: [newMsg.senderId, newMsg.receiverId],
          lastMessage: msg.content,
        });

        // Also emit the message back to sender so UI can update
        socket.emit('message_sent', newMsg);
      } catch (error) {
        console.error('Error handling private_message:', error);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data: { to: string }) => {
      const receiverSocket = onlineUsers.get(data.to);
      if (receiverSocket) {
        io.to(receiverSocket).emit('typing', { from: socket.userId });
      }
    });

    socket.on('stop_typing', (data: { to: string }) => {
      const receiverSocket = onlineUsers.get(data.to);
      if (receiverSocket) {
        io.to(receiverSocket).emit('stop_typing', { from: socket.userId });
      }
    });

    socket.on('mark_as_read', async (roomId: string) => {
      await MessageService.markMessagesAsRead(roomId, socket.userId!);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId!);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });
  });
};

 
