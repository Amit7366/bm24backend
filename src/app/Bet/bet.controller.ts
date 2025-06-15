// controllers/bet.controller.ts
import { Request, Response } from 'express';
import {
  placeBetService,
  settleBetService,
  getUserWeeklyStatsService,
  getUserBetsService,
  adminGetAllBetsService,
  getUserWeeklyStatsChartService,
} from '../Bet/bet.service';

export const BetController = {
  placeBet: async (req: Request, res: Response) => {
    // console.log(req.user)
    try {
      
      const bet = await placeBetService({ ...req.body, userId: req.user?.objectId });
      res.status(201).json({ message: 'Bet placed successfully', bet });
    } catch (error: any) {
      res.status(400).json({ message: 'Bet placement failed', error: error.message });
    }
  },

  settleBet: async (req: Request, res: Response) => {
    try {
      const bet = await settleBetService(req.body);
      res.status(200).json({ message: `Bet ${req.body.result} processed successfully`, bet });
    } catch (error: any) {
      res.status(400).json({ message: 'Bet settlement failed', error: error.message });
    }
  },

  getUserWeeklyStats: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.objectId;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }

      const stats = await getUserWeeklyStatsService(userId, date as string);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch weekly stats', error: error.message });
    }
  },
  getUserWeeklyChartStatsController : async (req: Request, res: Response) => {
  try {
    const userId = req.user.objectId; // Or however your auth system attaches user
    const numberOfWeeks = parseInt(req.query.weeks as string) || 6;
    const weekStartOnMonday = req.query.startMonday === 'true';

    const stats = await getUserWeeklyStatsChartService(userId, numberOfWeeks, weekStartOnMonday);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weekly chart stats', error });
  }
},

  getUserBets: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const bets = await getUserBetsService({ ...req.query, userId });
      res.status(200).json(bets);
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch user bets', error: error.message });
    }
  },

  adminGetAllBets: async (req: Request, res: Response) => {
    try {
      const bets = await adminGetAllBetsService(req.query);
      res.status(200).json(bets);
    } catch (error: any) {
      res.status(500).json({ message: 'Admin bet fetch failed', error: error.message });
    }
  },
};
