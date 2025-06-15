import { z } from 'zod';

export const createMessageZodSchema = z.object({
  senderId: z.string({ required_error: 'Sender ID is required' }),
  receiverId: z.string({ required_error: 'Receiver ID is required' }),
  content: z.string({ required_error: 'Content is required' }),
  roomId: z.string({ required_error: 'Room ID is required' }),
});
