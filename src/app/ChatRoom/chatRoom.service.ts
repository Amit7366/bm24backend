import { ChatRoom } from './chatRoom.model';
import { IChatRoom } from './chatRoom.interface';
import { Types } from 'mongoose';

const createOrUpdateChatRoom = async (payload: {
  roomId: string;
  members: Types.ObjectId[];
  lastMessage: string;
}): Promise<IChatRoom> => {
  const existing = await ChatRoom.findOne({ roomId: payload.roomId });

  if (existing) {
    existing.lastMessage = payload.lastMessage;
    existing.lastMessageAt = new Date();
    return await existing.save();
  }

  const newRoom = await ChatRoom.create({
    roomId: payload.roomId,
    members: payload.members,
    lastMessage: payload.lastMessage,
    lastMessageAt: new Date(),
  });

  return newRoom;
};

const getUserChatRooms = async (userId: string): Promise<IChatRoom[]> => {
 return await ChatRoom.find({ members: new Types.ObjectId(userId) }).sort({ updatedAt: -1 });

};

export const ChatRoomService = {
  createOrUpdateChatRoom,
  getUserChatRooms,
};
