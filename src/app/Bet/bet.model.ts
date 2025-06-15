import mongoose, { Schema, Document } from 'mongoose';

export interface IBet extends Document {
  userId: mongoose.Types.ObjectId;
  gameId: string;
  betAmount: number;
  odds: number;
  betType: string;
  status: 'pending' | 'win' | 'lose' | 'cancelled';
  winAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    gameId: { type: String, required: true },
    betAmount: { type: Number, required: true },
    odds: { type: Number, required: true },
    betType: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'win', 'lose', 'cancelled'],
      default: 'pending',
      index: true,
    },
    winAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBet>('bets', BetSchema);