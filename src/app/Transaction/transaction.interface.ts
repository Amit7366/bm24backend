// transaction.interface.ts
import { Types } from 'mongoose';

export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  paymentMethod: 'bkash' | 'nagad' | 'rocket';
  transactionType: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  transactionId: string;
  invoiceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}