// interfaces/checkin.interface.ts
import { Types } from 'mongoose';

export interface ICheckin {
  userId: Types.ObjectId;
  checkinDates: Date[];
  rewardGiven: boolean;
}
