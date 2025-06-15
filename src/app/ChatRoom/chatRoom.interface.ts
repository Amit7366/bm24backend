import { Document, Types } from 'mongoose';

export interface IChatRoom extends Document {
  roomId: string;
  members: Types.ObjectId[];
  lastMessage: string;
  lastMessageAt: Date;
}
