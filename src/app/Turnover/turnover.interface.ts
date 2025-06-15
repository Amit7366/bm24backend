import { Types } from 'mongoose';

export interface ITurnover {
  userId: string | Types.ObjectId;
  amount: number;
  gameType: 'sports' | 'casino' | 'lottery' | 'other';
  timestamp?: Date;
}
