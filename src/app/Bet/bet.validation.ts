import { z } from 'zod';

export const BetResultEnum = z.enum(['win', 'lose', 'cancelled']);

const bodyPlaceBetSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  gameId: z.string().min(1, 'gameId is required'),
  betAmount: z.number().positive('betAmount must be a positive number'),
  odds: z.number().positive('odds must be a positive number'),
  betType: z.string().min(1, 'betType is required'),
});

const bodySettleBetSchema = z.object({
  betId: z.string().min(1, 'betId is required'),
  result: BetResultEnum,
});

// ⬇️ Match shape for validateRequest({ body, query, cookies })
export const placeBetSchema = z.object({
  body: bodyPlaceBetSchema,
});

export const settleBetSchema = z.object({
  body: bodySettleBetSchema,
});
