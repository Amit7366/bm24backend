import { Schema, model } from 'mongoose';
import { IUserOffer } from './userOffer.interface';

const userOfferSchema = new Schema<IUserOffer>(
    {
        offerName: { type: String, required: true },
        value: { type: Number, required: true },
        valueType: { type: String, enum: ['fixed', 'percent'], required: true },
        status: { type: String, enum: ['on', 'off'], default: 'off' },
        activeDates: { type: [Number], required: true } // example: [5, 10, 25]
    },
    { timestamps: true }
);

export const UserOffer = model<IUserOffer>('UserOffer', userOfferSchema);
