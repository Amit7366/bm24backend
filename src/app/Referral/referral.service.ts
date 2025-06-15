import mongoose from "mongoose";
import { ReferralRewardModel } from "../ReferralRewardTracker/referralReward.model";
import { UserBalance } from "../Transaction/userBalance.model";
import { ReferralModel } from "./referral.model";

export const trackReferral = async (
  referredUserId: string,
  referrerId: string,
  externalSession?: mongoose.ClientSession
) => {
  const session = externalSession || await mongoose.startSession();
  let ownSession = false;
  if (!externalSession) {
    session.startTransaction();
    ownSession = true;
  }

  try {
    await ReferralModel.create(
      [{ referredUser: referredUserId, referrer: referrerId }],
      { session }
    );

    let reward = await ReferralRewardModel.findOne({ referrer: referrerId }).session(session);
    if (!reward) {
      [reward] = await ReferralRewardModel.create(
        [{
          referrer: referrerId,
          totalReferred: 1,
          totalPendingTK: 0,
          totalPendingCoin: 0
        }],
        { session }
      );
    } else {
      reward.totalReferred += 1;
      await reward.save({ session });
    }

    const rewardAmountTK = 300;
    const rewardAmountCoin = 300;

    // ✅ Check if referrer has made a deposit
    const hasDeposited = await UserBalance.exists({
      userId: referrerId,
      totalDeposit: { $gt: 0 },
    });

    if (hasDeposited) {
      // ✅ Give reward immediately
      await UserBalance.findOneAndUpdate(
        { userId: referrerId },
        {
          $inc: {
            currentBalance: rewardAmountTK,
            currentCoinBalance: rewardAmountCoin,
            totalCoinDeposit: rewardAmountCoin,
          },
        },
        { session, upsert: true, new: true }
      );
    } else {
      // ❌ Hold reward if no deposit
      reward.totalPendingTK = (reward.totalPendingTK || 0) + rewardAmountTK;
      reward.totalPendingCoin = (reward.totalPendingCoin || 0) + rewardAmountCoin;
      await reward.save({ session });
    }

    // ✅ Bonus logic after 5 referrals within 7 days
    const referrals = await ReferralModel.find({ referrer: referrerId })
      .session(session)
      .sort({ referredAt: 1 });

    if (referrals.length >= 5 && !reward.bonusGiven) {
      const firstFive = referrals.slice(0, 5);
      const firstDate = firstFive[0]?.referredAt;
      const fifthDate = firstFive[4]?.referredAt;

      if (firstDate && fifthDate) {
        const diffDays = (fifthDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 7) {
          reward.bonusGiven = true;
          reward.qualifiedForBonus = true;

          if (hasDeposited) {
            // ✅ Give 1500 coin bonus immediately
            await UserBalance.findOneAndUpdate(
              { userId: referrerId },
              {
                $inc: {
                  currentCoinBalance: 1500,
                  totalCoinDeposit: 1500,
                },
              },
              { session }
            );
          } else {
            // ❌ Hold 1500 coin bonus
            reward.totalPendingCoin = (reward.totalPendingCoin || 0) + 1500;
          }

          await reward.save({ session });
        }
      }
    }

    if (ownSession) await session.commitTransaction();
  } catch (err) {
    if (ownSession) await session.abortTransaction();
    throw err;
  } finally {
    if (ownSession) session.endSession();
  }
};
