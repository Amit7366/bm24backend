import { z } from 'zod';

export const turnoverSchema = z.object({
    userId: z.string({ required_error: 'User ID is required' }),
    amount: z.number().positive('Amount must be positive'),
    gameType: z.enum(['sports', 'casino', 'lottery', 'other']),
});