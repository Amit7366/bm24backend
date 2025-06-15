import { Schema, model, Types } from 'mongoose';

const userBalanceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, ref: 'User' },

    totalDeposit: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },

    // New fields for coin balance
    currentCoinBalance: { type: Number, default: 300 },
    totalCoinDeposit: { type: Number, default: 300 },
    totalCoinWithdraw: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UserBalance = model('UserBalance', userBalanceSchema);
