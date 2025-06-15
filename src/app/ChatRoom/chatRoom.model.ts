import { Schema, model } from 'mongoose';
import { IChatRoom } from './chatRoom.interface';

const chatRoomSchema = new Schema<IChatRoom>(
  {
    roomId: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ChatRoom = model<IChatRoom>('ChatRoom', chatRoomSchema);
