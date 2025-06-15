import { Types } from 'mongoose';

export interface IMessage {
    _id?: string;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    roomId: string;
    isRead: boolean,
    createdAt?: Date;
    updatedAt?: Date;
}
