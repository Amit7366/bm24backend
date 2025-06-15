// transaction.service.ts
import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { UserBalance } from './userBalance.model';
import { UserOffer } from '../UserOffer/userOffer.model';
import dayjs from 'dayjs';
import { releaseReferralBonuses } from '../ReferralRewardTracker/rewardRelease.util';
import { NormalUser } from '../NormalUser/normalUser.model';
import { User } from '../User/user.model';
import { determineUserLevel } from './userLevel.util';

const createManualWithdraw = async (data: Partial<ITransaction>) => {
  const { userId, amount, paymentMethod, transactionId } = data;
  if (!userId || !amount || !paymentMethod || !transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  const userBalance = await UserBalance.findOne({ userId });
  if (!userBalance || userBalance.currentBalance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
  }

  const trx = await Transaction.create({
    userId,
    amount,
    paymentMethod,
    transactionType: 'withdraw',
    transactionId,
    status: 'pending',
    invoiceId: uuidv4(),
  });

  return trx;
};

const createManualDeposit = async (data: Partial<ITransaction>) => {
  const { userId, amount, paymentMethod, transactionId } = data;

  if (!userId || !amount || !paymentMethod || !transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing required fields');
  }

  // Get today's date number
  const todayDate = dayjs().date();
  
  // Look for an active offer matching today's date
  const activeOffer = await UserOffer.findOne({
    status: 'on',
    activeDates: { $in: [todayDate] },
  });

  let finalAmount = amount;

  if (activeOffer) {
    const { value, valueType } = activeOffer;

    if (valueType === 'percent') {
      finalAmount = amount + amount * (value / 100);
    } else if (valueType === 'fixed') {
      finalAmount = amount + value;
    }
  }

  const trx = await Transaction.create({
    userId,
    amount: finalAmount, // ✅ apply the calculated amount
    paymentMethod,
    transactionType: 'deposit',
    transactionId,
    status: 'pending',
    invoiceId: uuidv4(),
  });

  return trx;
};

const markWithdrawSuccess = async (trxId: string) => {
  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending' || trx.transactionType !== 'withdraw') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }

  trx.status = 'success';
  await trx.save();

  await UserBalance.findOneAndUpdate(
    { userId: trx.userId },
    { $inc: { totalWithdraw: trx.amount, currentBalance: -trx.amount } }
  );

  return trx;
};
const markCoinWithdrawSuccess = async (userId: string, coinAmount: number) => {
  const userBalance = await UserBalance.findOne({ userId });

  if (!userBalance) {
    throw new AppError(httpStatus.NOT_FOUND, 'User balance record not found');
  }

  if (userBalance.currentCoinBalance < coinAmount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient coin balance');
  }

  const updated = await UserBalance.findOneAndUpdate(
    { userId },
    {
      $inc: {
        totalCoinWithdraw: coinAmount,
        currentCoinBalance: -coinAmount,
      },
    },
    { new: true }
  );

  return updated;
};




export const markDepositSuccess = async (trxId: string) => {
  if (!trxId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction ID is required');
  }

  // ✅ Step 1: Get the transaction
  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending' || trx.transactionType !== 'deposit') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }

  // ✅ Step 2: Check if it's the user's first successful deposit
  const existingSuccessfulDeposits = await Transaction.countDocuments({
    userId: trx.userId,
    transactionType: 'deposit',
    status: 'success',
  });

  const isFirstDeposit = existingSuccessfulDeposits === 0;

  // ✅ Step 3: Mark this transaction as successful
  trx.status = 'success';
  await trx.save();

  // ✅ Step 4: Update user balance
  const updatedBalance = await UserBalance.findOneAndUpdate(
    { userId: trx.userId },
    { $inc: { totalDeposit: trx.amount, currentBalance: trx.amount } },
    { upsert: true, new: true }
  );

  // ✅ Step 5: Release referral bonuses if it's the first deposit
  if (isFirstDeposit) {
    await releaseReferralBonuses(trx.userId.toString());
  }

  // ✅ Step 6: Determine the new user level
  const totalDeposit = updatedBalance?.totalDeposit || 0;
  const newLevel = determineUserLevel(totalDeposit);

  // ✅ Step 7: Update User collection
  await User.findByIdAndUpdate(trx.userId, { userLevel: newLevel });

  // ✅ Step 8: Update NormalUser collection
  await NormalUser.findOneAndUpdate(
    { user: trx.userId },
    { userLevel: newLevel }
  );

  return trx;
};


const getUserBalance = async (userId: string) => {
  const balance = await UserBalance.findOne({ userId });
  if (!balance) throw new AppError(httpStatus.NOT_FOUND, 'Balance not found');
  return balance;
};

const getAllTransactions = async (filter: any) => {
  const result = await Transaction.find(filter).populate('userId').sort({ createdAt: -1 });
  return result;
};

const rejectWithdraw = async (trxId: string) => {
  const trx = await Transaction.findById(trxId);
  if (!trx || trx.status !== 'pending') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction');
  }
  trx.status = 'failed';
  await trx.save();
  return trx;
};

export const TransactionService = {
  createManualDeposit,
  createManualWithdraw,
  markCoinWithdrawSuccess,
  markWithdrawSuccess,
  markDepositSuccess,
  getUserBalance,
  getAllTransactions,
  rejectWithdraw,
};
