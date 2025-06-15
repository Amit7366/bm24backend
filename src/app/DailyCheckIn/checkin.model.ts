// models/checkin.model.ts
import mongoose, { Schema } from 'mongoose';
import { ICheckin } from './checkin.interface';

const checkinSchema = new Schema<ICheckin>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkinDates: [{ type: Date, required: true }],
    rewardGiven: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CheckinModel = mongoose.model<ICheckin>('DailyCheckin', checkinSchema);
