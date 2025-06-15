// transaction.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { TransactionService } from './transaction.service';
import { Request, Response } from 'express';
import AppError from '../errors/AppError';

const createManualDeposit = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createManualDeposit(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Manual deposit transaction created successfully!',
    data: result,
  });
});

const createManualWithdraw = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createManualWithdraw(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Manual withdraw transaction created successfully!',
    data: result,
  });
});

const approveWithdraw = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.markWithdrawSuccess(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw approved and balance updated!',
    data,
  });
});
const approveCoinWithdraw = catchAsync(async (req: Request, res: Response) => {
  const { userId, coinAmount } = req.query;
 
  if (!userId || !coinAmount) {
    throw new AppError
    (httpStatus.BAD_REQUEST, 'userId and coinAmount are required');
  }

  const data = await TransactionService.markCoinWithdrawSuccess(
    String(userId),
    Number(coinAmount)
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coin withdrawal approved and balances updated!',
    data,
  });
});


const approveDeposit = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.markDepositSuccess(req.params.id);
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deposit approved and balance updated!',
    data,
  });
});

const getBalance = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.params.userId);
  const data = await TransactionService.getUserBalance(req.params.userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User balance fetched successfully!',
    data,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.getAllTransactions(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transactions fetched successfully!',
    data,
  });
});

const rejectWithdraw = catchAsync(async (req: Request, res: Response) => {
  const data = await TransactionService.rejectWithdraw(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdraw rejected successfully!',
    data,
  });
});

export const TransactionController = {
  createManualDeposit,
  createManualWithdraw,
  approveCoinWithdraw,
  approveWithdraw,
  approveDeposit,
  getBalance,
  getAllTransactions,
  rejectWithdraw,
};