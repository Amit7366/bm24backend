import express from 'express';

import { USER_ROLE } from '../../User/user.constant';
import { WeeklyRewardController } from '../controllers/weeklyReward.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.get(
  '/rewards',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  WeeklyRewardController.getWeeklyRewards
);

router.patch(
  '/rewards/:id/claim',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin,USER_ROLE.user),
  WeeklyRewardController.markRewardAsClaimed
);

// Optional route to trigger reward generation manually
router.post(
  '/rewards/generate',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  WeeklyRewardController.generateWeeklyRewards
);

export const WeeklyRewardRoutes = router;
