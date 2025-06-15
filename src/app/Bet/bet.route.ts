import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { BetController } from './bet.controller';
import { placeBetSchema, settleBetSchema } from './bet.validation';

const router = express.Router();

// USER ROUTES
router.post(
  '/place',
  auth(USER_ROLE.user),
  validateRequest(placeBetSchema),
  BetController.placeBet
);

router.get(
  '/weekly-stats',
  auth(USER_ROLE.user),
  BetController.getUserWeeklyStats
);
router.get('/weekly-stats/chart', auth(USER_ROLE.user), BetController.getUserWeeklyChartStatsController);

router.get(
  '/history',
  auth(USER_ROLE.user),
  BetController.getUserBets
);

// ADMIN ROUTES
router.post(
  '/settle',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(settleBetSchema),
  BetController.settleBet
);

router.get(
  '/admin/all',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  BetController.adminGetAllBets
);

export const BetRoutes = router;
