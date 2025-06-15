import express from 'express';
import { checkinController } from './checkin.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';


const router = express.Router();

router.post('/checkin',auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.user), checkinController.dailycheckin);

export const CheckinRoutes = router;
