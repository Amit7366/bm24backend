import { Schema, model } from 'mongoose';
import { IReferralReward } from './referralReward.interface';

const ReferralRewardSchema = new Schema<IReferralReward>({
  referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalReferred: { type: Number, default: 0 },
  qualifiedForBonus: { type: Boolean, default: false },
  bonusGiven: { type: Boolean, default: false },
  totalPendingTK: { type: Number, default: 0 }, // ⬅ hold TK here
  totalPendingCoin: { type: Number, default: 0 }, // ⬅ hold Coin here
  createdAt: { type: Date, default: Date.now },
});

export const ReferralRewardModel = model<IReferralReward>('ReferralReward', ReferralRewardSchema);
