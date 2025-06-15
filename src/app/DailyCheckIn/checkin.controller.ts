import { Request, Response } from 'express';
import httpStatus from 'http-status'; // Make sure you installed `http-status`
import { checkinSchema } from './checkin.validation';
import { checkinservice } from './checkin.service';
import sendResponse from '../utilis/sendResponse';


const dailycheckin = async (req: Request, res: Response) => {
  try {
    const parseResult = checkinSchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: parseResult.error.errors[0].message,
      });
    }

    const { userId } = parseResult.data;
    const result = await checkinservice.handleCheckin(userId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null, // Set to `result.data` if needed
    });
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Check-in failed.',
    });
  }
};

export const checkinController = {
  dailycheckin,
};
