import { Router } from 'express';
import { UserRoutes } from '../User/user.route';
import { AdminRoutes } from '../Admin/admin.route';
import { AuthRoutes } from '../Auth/auth.route';
import { NormalUserRoutes } from '../NormalUser/normalUser.route';
import { TransactionRoutes } from '../Transaction/transaction.route';
import { UserOfferRoutes } from '../UserOffer/userOffer.route';
import { CheckinRoutes } from '../DailyCheckIn/checkin.route';
import { TurnoverRoutes } from '../Turnover/turnover.route';
import { MessageRoutes } from '../Message/message.route';
import { ChatRoomRoutes } from '../ChatRoom/chatRoom.route';
import { BetRoutes } from '../Bet/bet.route';
import { WeeklyRewardRoutes } from '../WeeklyReward/routes/weeklyReward.routes';
import { callbackRoute } from '../Bet/callback.route';
import { launchGameRoute } from '../Bet/game.route';
const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/normalUsers',
    route: NormalUserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/userOffer',
    route: UserOfferRoutes,
  },
  {
    path: '/transaction',
    route: TransactionRoutes,
  },
  {
    path: '/dailyCheckin',
    route: CheckinRoutes,
  },
  {
    path: '/turnover',
    route: TurnoverRoutes,
  },
  {
    path: '/messages',
    route: MessageRoutes,
  },
  {
    path: '/chatRooms',
    route: ChatRoomRoutes,
  },
  {
    path: '/bets',
    route: BetRoutes,
  },
  {
    path: '/callback',
    route: callbackRoute,
  },
  {
    path: '/launchGame',
    route: launchGameRoute,
  },
  {
    path: '/weeklyReward',
    route: WeeklyRewardRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
