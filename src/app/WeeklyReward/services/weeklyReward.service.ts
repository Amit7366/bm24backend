import mongoose from 'mongoose';
import { Request } from 'express';
import { WeeklyRewardModel } from '../models/weeklyReward.model';
import { getCashbackPercent } from '../utils/cashback.util';
import { getCurrentWeekRange } from '../utils/date.util';
import { getUserWeeklyStatsService } from '../../Bet/bet.service';
import { User } from '../../User/user.model';
import { UserBalance } from '../../Transaction/userBalance.model';
import { UserLevel } from '../../Transaction/userLevel.util';

export class WeeklyRewardService {
  static async getWeeklyRewards(req: Request) {
    const { claimed, userId, page = 1, limit = 10 } = req.query;
    const filters: any = {};
    if (claimed !== undefined) filters.claimed = claimed === 'true';
    if (userId && mongoose.Types.ObjectId.isValid(userId as string)) filters.userId = userId;

    const rewards = await WeeklyRewardModel.find(filters)
      .populate('userId', 'userName contactNo userLevel')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await WeeklyRewardModel.countDocuments(filters);

    return { total, page: +page, limit: +limit, rewards };
  }

  static async markRewardAsClaimed(id: string) {
    // Step 1: Get the reward
    const reward = await WeeklyRewardModel.findById(id);

    if (!reward) {
      throw new Error('Reward not found');
    }

    // Step 2: Prevent double-claim
    if (reward.claimed) {
      throw new Error('This reward has already been claimed.');
    }

    // Step 3: Update reward as claimed
    reward.claimed = true;
    await reward.save();

    // Step 4: Fetch user balance record
    const userBalance = await UserBalance.findOne({ userId: reward.userId });

    if (!userBalance) {
      throw new Error('User balance record not found');
    }

    // ✅ Step 5: Safely add reward amount (ensure number type)
    userBalance.currentBalance += Number(reward.reward);
    await userBalance.save();

    return reward;
  }



  static async generateWeeklyRewards(): Promise<number> {
    const { start, end } = getCurrentWeekRange();
    const users = await User.find({ role: 'user', isDeleted: false });

    let generatedCount = 0;

    for (const user of users) {
      const stats = await getUserWeeklyStatsService(user._id.toString(), end.toISOString());
      const netProfit = stats.netProfit;

      if (netProfit >= 0) continue;

      const netLoss = Math.abs(netProfit);
      const userLevel: UserLevel = (user.userLevel ?? 'Normal') as UserLevel;

      const cashbackPercent = getCashbackPercent(userLevel, netLoss);


      const reward = Number((netLoss * cashbackPercent).toFixed(2));

      const alreadyExists = await WeeklyRewardModel.findOne({
        userId: user._id,
        weekStart: stats.weekStart,
        weekEnd: stats.weekEnd,
      });

      if (!alreadyExists && reward > 0) {
        await WeeklyRewardModel.create({
          userId: user._id,
          tier: user.userLevel,
          netLoss,
          reward,
          weekStart: stats.weekStart,
          weekEnd: stats.weekEnd,
          claimed: false,
        });
        generatedCount++;
      }
    }

    return generatedCount;
  }
}
