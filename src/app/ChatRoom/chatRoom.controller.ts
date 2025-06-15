import { Request, Response } from 'express';
import { ChatRoomService } from './chatRoom.service';

import { IChatRoom } from './chatRoom.interface';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';

export const getMyChatRooms = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  console.log("object`User ID: ${user._id}`",user);
  const result = await ChatRoomService.getUserChatRooms(user.objectId);

  sendResponse<IChatRoom[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User chat rooms fetched successfully',
    data: result,
  });
});
