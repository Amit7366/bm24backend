import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import { UserOfferService } from './userOffer.service';
import { IUserOffer } from './userOffer.interface';
import sendResponse from '../utilis/sendResponse';
import AppError from '../errors/AppError';

export const UserOfferController = {
  createUserOffer: catchAsync(async (req: Request, res: Response) => {
    const result = await UserOfferService.createUserOffer(req.body as IUserOffer);

    sendResponse<IUserOffer>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User offer created successfully!',
      data: result,
    });
  }),

  getAllUserOffers: catchAsync(async (_req: Request, res: Response) => {
    const result = await UserOfferService.getAllUserOffers();

    sendResponse<IUserOffer[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All user offers fetched successfully!',
      data: result,
    });
  }),

  getSingleUserOffer: catchAsync(async (req: Request, res: Response) => {
    const result = await UserOfferService.getSingleUserOffer(req.params.id);
  if (!result) {
  throw new AppError(httpStatus.NOT_FOUND, 'User offer not found');
}
    sendResponse<IUserOffer>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single user offer fetched successfully!',
      data: result,
    });
  }),

  updateUserOffer: catchAsync(async (req: Request, res: Response) => {
    const result = await UserOfferService.updateUserOffer(req.params.id, req.body);
    if (!result) {
  throw new AppError(httpStatus.NOT_FOUND, 'User offer not found');
}

    sendResponse<IUserOffer>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User offer updated successfully!',
      data: result,
    });
  }),

  deleteUserOffer: catchAsync(async (req: Request, res: Response) => {
    await UserOfferService.deleteUserOffer(req.params.id);

    sendResponse<null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User offer deleted successfully!',
      data: null,
    });
  }),
};
