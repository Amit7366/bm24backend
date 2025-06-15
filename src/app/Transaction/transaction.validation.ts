// transaction.validation.ts
import { z } from 'zod';

export const depositValidation = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    paymentMethod: z.enum(['bkash', 'nagad', 'rocket']),
    transactionType: z.enum(['deposit', 'withdraw']),
    status: z.enum(['pending', 'success', 'failed']),
    transactionId: z.string().min(1, 'Transaction ID is required'),
  }),
});

export const withdrawValidation = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    paymentMethod: z.enum(['bkash', 'nagad', 'rocket']),
    transactionId: z.string().min(1, 'Transaction ID is required'),
  }),
});
export const coinWithdrawValidation = z.object({
  query: z.object({
    userId: z
      .string({
        required_error: 'userId is required',
        invalid_type_error: 'userId must be a string',
      })
      .min(1, 'userId cannot be empty'),

    coinAmount: z
      .string({
        required_error: 'coinAmount is required',
        invalid_type_error: 'coinAmount must be a number in string format',
      })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'coinAmount must be a positive number',
      }),
  }),
});