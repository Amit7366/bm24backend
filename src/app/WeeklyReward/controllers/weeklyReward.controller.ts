import { Request, Response } from 'express';
import { WeeklyRewardService } from '../services/weeklyReward.service';

export class WeeklyRewardController {
  static async getWeeklyRewards(req: Request, res: Response) {
    try {
      const result = await WeeklyRewardService.getWeeklyRewards(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rewards', error });
    }
  }

  static async markRewardAsClaimed(req: Request, res: Response) {
  try {
    const reward = await WeeklyRewardService.markRewardAsClaimed(req.params.id);
    res.status(200).json({
      message: 'Reward claimed and balance updated successfully.',
      reward,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Error claiming reward.',
    });
  }
}


  static async generateWeeklyRewards(_: Request, res: Response) {
    try {
      const count = await WeeklyRewardService.generateWeeklyRewards();
      res.status(200).json({ message: `Generated ${count} new weekly rewards.` });
    } catch (error) {
      res.status(500).json({ message: 'Error generating rewards', error });
    }
  }
}
