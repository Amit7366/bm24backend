// validations/checkin.validation.ts
import { z } from 'zod';

export const checkinSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});
