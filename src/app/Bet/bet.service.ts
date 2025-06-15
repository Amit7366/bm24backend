// services/bet.service.ts
import mongoose from 'mongoose';
import Bet from './bet.model';
import { UserBalance } from '../Transaction/userBalance.model';
import { BetTransaction } from '../Transaction/betTransaction.model';

export const placeBetService = async (data: any) => {
  const { userId, gameId, betAmount, odds, betType } = data;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userBalance = await UserBalance.findOne({ userId }).session(session);
    if (!userBalance || userBalance.currentBalance < betAmount) {
      throw new Error('Insufficient balance');
    }

    userBalance.currentBalance -= betAmount;
    await userBalance.save({ session });

    const bet = new Bet({
      userId,
      gameId,
      betAmount,
      odds,
      betType,
      status: 'pending',
    });
    await bet.save({ session });

    const transaction = new BetTransaction({
      userId,
      amount: betAmount,
      type: 'bet',
      status: 'completed',
      metadata: { betId: bet._id, gameId },
    });
    await transaction.save({ session });

    await session.commitTransaction();
    return bet;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const settleBetService = async (data: any) => {
  const { betId, result } = data;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bet = await Bet.findById(betId).session(session);
    if (!bet || bet.status !== 'pending') throw new Error('Bet not found or already settled');

    const userBalance = await UserBalance.findOne({ userId: bet.userId }).session(session);
    if (!userBalance) throw new Error('User balance not found');

    if (result === 'win') {
      const winAmount = bet.betAmount * bet.odds;
      bet.status = 'win';
      bet.winAmount = winAmount;
      userBalance.currentBalance += winAmount;

      await new BetTransaction({
        userId: bet.userId,
        amount: winAmount,
        type: 'win',
        status: 'completed',
        metadata: { betId: bet._id },
      }).save({ session });
    } else if (result === 'lose') {
      bet.status = 'lose';
      bet.winAmount = 0;
    } else if (result === 'cancelled') {
      bet.status = 'cancelled';
      bet.winAmount = 0;
      userBalance.currentBalance += bet.betAmount;

      await new BetTransaction({
        userId: bet.userId,
        amount: bet.betAmount,
        type: 'refund',
        status: 'completed',
        metadata: { betId: bet._id },
      }).save({ session });
    } else {
      throw new Error('Invalid result type');
    }

    await bet.save({ session });
    await userBalance.save({ session });

    await session.commitTransaction();
    return bet;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserWeeklyStatsService = async (userId: string, dateStr: string) => {
  const endDate = new Date(dateStr);
  endDate.setUTCHours(23, 59, 59, 999); // <-- Fix: include entire end day

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);
  startDate.setUTCHours(0, 0, 0, 0); // <-- Optional: normalize start of day

  const stats = await Bet.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['win', 'lose'] },
      },
    },
    {
      $group: {
        _id: '$status',
        totalBets: { $sum: 1 },
        totalAmount: { $sum: '$betAmount' },
        totalWinAmount: { $sum: '$winAmount' },
      },
    },
  ]);

  const win = stats.find(s => s._id === 'win') || { totalBets: 0, totalAmount: 0, totalWinAmount: 0 };
  const lose = stats.find(s => s._id === 'lose') || { totalBets: 0, totalAmount: 0, totalWinAmount: 0 };

  return {
    weekStart: startDate,
    weekEnd: endDate,
    winCount: win.totalBets,
    winAmount: win.totalWinAmount,
    loseCount: lose.totalBets,
    loseAmount: lose.totalAmount,
    netProfit: win.totalWinAmount - lose.totalAmount,
  };
};

export const getUserWeeklyStatsChartService = async (
  userId: string,
  numberOfWeeks: number = 6, // Last 6 weeks by default
  weekStartOnMonday: boolean = true // Change to false for Sunday start
) => {
  const now = new Date();
  const endDate = new Date(now);

  // Align to the start of this week (Monday or Sunday)
  const day = endDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const daysToSubtract = weekStartOnMonday ? (day === 0 ? 6 : day - 1) : day;
  const alignedEndDate = new Date(endDate);
  alignedEndDate.setDate(endDate.getDate() - daysToSubtract);
  alignedEndDate.setHours(0, 0, 0, 0);

  // Calculate start date for N weeks
  const alignedStartDate = new Date(alignedEndDate);
  alignedStartDate.setDate(alignedStartDate.getDate() - 7 * (numberOfWeeks - 1));

  const stats = await Bet.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: alignedStartDate },
        status: { $in: ['win', 'lose'] },
      },
    },
    {
      $addFields: {
        weekStart: {
          $dateTrunc: {
            date: '$createdAt',
            unit: 'week',
            binSize: 1,
            timezone: 'UTC',
            startOfWeek: weekStartOnMonday ? 'monday' : 'sunday',
          },
        },
      },
    },
    {
      $group: {
        _id: {
          weekStart: '$weekStart',
        },
        winAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'win'] }, '$winAmount', 0],
          },
        },
        loseAmount: {
          $sum: {
            $cond: [{ $eq: ['$status', 'lose'] }, '$betAmount', 0],
          },
        },
        totalBetAmount: { $sum: '$betAmount' },
        totalBets: { $sum: 1 },
        winCount: { $sum: { $cond: [{ $eq: ['$status', 'win'] }, 1, 0] } },
        loseCount: { $sum: { $cond: [{ $eq: ['$status', 'lose'] }, 1, 0] } },
      },
    },
    {
      $sort: { '_id.weekStart': 1 },
    },
    {
      $project: {
        _id: 0,
        weekStart: '$_id.weekStart',
        winAmount: 1,
        loseAmount: 1,
        totalBetAmount: 1,
        totalBets: 1,
        winCount: 1,
        loseCount: 1,
        netProfit: { $subtract: ['$winAmount', '$loseAmount'] },
      },
    },
  ]);

  return stats;
};
export const getUserBetsService = async (query: any) => {
  const filter: any = {};
  if (query.userId) filter.userId = query.userId;
  if (query.status) filter.status = query.status;
  if (query.gameId) filter.gameId = query.gameId;

  return Bet.find(filter).sort({ createdAt: -1 });
};

export const adminGetAllBetsService = async (query: any) => {
  const filter: any = {};
  if (query.status) filter.status = query.status;
  if (query.userId) filter.userId = query.userId;

  return Bet.find(filter).sort({ createdAt: -1 });
};
