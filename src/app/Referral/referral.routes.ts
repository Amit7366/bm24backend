import { Router } from 'express';
import { referralSignupHandler } from './referral.controller';

const router = Router();

router.post('/track', referralSignupHandler);

export default router;