import mongoose, { Schema } from 'mongoose';

const betTransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['bet', 'win', 'refund'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    metadata: {
      betId: { type: Schema.Types.ObjectId, ref: 'Bet' },
      gameId: { type: String },
      roundId: { type: String },
      serialNumber: { type: String },
      currencyCode: { type: String },
    },
  },
  { timestamps: true }
);

export const BetTransaction = mongoose.model('BetTransaction', betTransactionSchema);
