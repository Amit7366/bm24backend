import { z } from 'zod';

export const createUserOfferValidation = z.object({
  body: z.object({
    offerName: z.string({ required_error: 'Offer name is required' }),
    value: z.number({ required_error: 'Value is required' }),
    valueType: z.enum(['fixed', 'percent']),
    status: z.enum(['on', 'off']).optional(),
    activeDates: z.array(z.number().min(1).max(31), { required_error: 'Active dates are required' })
  })
});

export const updateUserOfferValidation = z.object({
  body: z.object({
    offerName: z.string().optional(),
    value: z.number().optional(),
    valueType: z.enum(['fixed', 'percent']).optional(),
    status: z.enum(['on', 'off']).optional(),
    activeDates: z.array(z.number().min(1).max(31)).optional()
  })
});
