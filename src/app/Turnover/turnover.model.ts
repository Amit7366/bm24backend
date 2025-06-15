import { Schema, model } from 'mongoose';
import { ITurnover } from './turnover.interface';

const TurnoverSchema = new Schema<ITurnover>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        gameType: {
            type: String,
            enum: ['sports', 'casino', 'lottery', 'other'],
            required: true,
        },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const TurnoverModel = model<ITurnover>('Turnover', TurnoverSchema);