import { Schema, model } from 'mongoose';
import { IReferral } from './referral.interface';

const ReferralSchema = new Schema<IReferral>({
  referredUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referredAt: { type: Date, default: Date.now },
});

export const ReferralModel = model<IReferral>('Referral', ReferralSchema);
