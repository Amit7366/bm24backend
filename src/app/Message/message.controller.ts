import { Request, Response } from 'express';
import { MessageService } from './message.service';

import { IMessage } from './message.interface';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { ChatRoomService } from '../ChatRoom/chatRoom.service';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const messageData: IMessage = req.body;
  const result = await MessageService.createMessage(messageData);

  // 🧠 Create or update chat room
  await ChatRoomService.createOrUpdateChatRoom({
    roomId: messageData.roomId,
    members: [messageData.senderId, messageData.receiverId],
    lastMessage: messageData.content,
  });

  sendResponse<IMessage>(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});


export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await MessageService.getMessagesByRoom(roomId);

  sendResponse<IMessage[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});
