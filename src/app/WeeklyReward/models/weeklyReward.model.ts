import mongoose, { Schema } from "mongoose";

export interface IWeeklyReward extends Document {
  userId: mongoose.Types.ObjectId;
  tier: string;
  netLoss: number;
  reward: number | string;
  weekStart: Date;
  weekEnd: Date;
  claimed: boolean;
}

const weeklyRewardSchema = new Schema<IWeeklyReward>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  tier: { type: String, required: true },
  netLoss: { type: Number, required: true },
  reward: { type: Schema.Types.Mixed, required: true },
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  claimed: { type: Boolean, default: false },
}, { timestamps: true });

export const WeeklyRewardModel = mongoose.model<IWeeklyReward>('WeeklyReward', weeklyRewardSchema);
