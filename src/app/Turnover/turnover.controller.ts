import { Request, Response } from 'express';

import { createTurnover, getAdminTurnoverReport, getTurnoverGroupedByGameTypePerDay, getUserTurnover } from './turnover.service';
import { turnoverSchema } from './turnover.validation';

export const TurnoverController = {
  create: async (req: Request, res: Response) => {
  try {
    const parsed = turnoverSchema.parse(req.body);
    const result = await createTurnover(parsed);
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
},

  getUserTotal: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : undefined;
      const result = await getUserTurnover(userId, days);
      return res.status(200).json({ success: true, data: result[0]?.totalTurnover || 0 });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  getAdminReport: async (_req: Request, res: Response) => {
    try {
      const result = await getAdminTurnoverReport();
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  getGroupedByGameTypePerDay: async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await getTurnoverGroupedByGameTypePerDay(userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
},
};
