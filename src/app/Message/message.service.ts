import { IMessage } from './message.interface';
import { Message } from './message.model';

const createMessage = async (payload: IMessage): Promise<IMessage> => {
  return await Message.create(payload);
};

const getMessagesByRoom = async (roomId: string): Promise<IMessage[]> => {
  return await Message.find({ roomId }).sort({ createdAt: 1 });
};

const markMessagesAsRead = async (roomId: string, receiverId: string): Promise<void> => {
  await Message.updateMany({ roomId, receiverId, isRead: false }, { isRead: true });
};

const countUnreadMessages = async (receiverId: string): Promise<number> => {
  return await Message.countDocuments({ receiverId, isRead: false });
};

export const MessageService = {
  createMessage,
  getMessagesByRoom,
  markMessagesAsRead,
  countUnreadMessages,
};
