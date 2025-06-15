// interfaces/bet.interface.ts (recommended path)
import { Document, Types } from 'mongoose';

export interface IBet extends Document {
  userId: Types.ObjectId;
  gameId: string;
  betAmount: number;
  odds: number;
  betType: string;
  status: 'pending' | 'win' | 'lose' | 'cancelled';
  winAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
