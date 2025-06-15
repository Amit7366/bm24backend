import { Schema, model, Types } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    roomId: { type: String, required: true },
    isRead: { type: Boolean, default: false },

  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', messageSchema);
