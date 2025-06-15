import { Request, Response } from 'express';
import {  trackReferral } from './referral.service';


export const referralSignupHandler = async (req: Request, res: Response) => {
  const { referredUserId, referrerId } = req.body;
  try {
    await trackReferral(referredUserId, referrerId);
    res.status(201).json({ message: 'Referral tracked and rewards applied.' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking referral', error });
  }
};


