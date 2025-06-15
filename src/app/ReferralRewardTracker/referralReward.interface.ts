import { Types } from "mongoose";

export interface IReferralReward {
  referrer: Types.ObjectId;
  totalReferred: number;
  qualifiedForBonus: boolean;
  bonusGiven: boolean;
  totalPendingTK: number; // ⬅ hold TK here
  totalPendingCoin: number; // ⬅ hold Coin here
  createdAt?: Date;
}
