import { UserBalance } from "../Transaction/userBalance.model";
import { ReferralRewardModel } from "./referralReward.model";

export const releaseReferralBonuses = async (referrerId: string) => {
  const reward = await ReferralRewardModel.findOne({ referrer: referrerId });
  if (!reward || (!reward.totalPendingTK && !reward.totalPendingCoin)) return;

  await UserBalance.findOneAndUpdate(
    { userId: referrerId },
    {
      $inc: {
        currentBalance: reward.totalPendingTK || 0,
        currentCoinBalance: reward.totalPendingCoin || 0,
        totalCoinDeposit: reward.totalPendingCoin || 0,
      },
    },
    { new: true }
  );

  reward.totalPendingTK = 0;
  reward.totalPendingCoin = 0;
  await reward.save();
};
