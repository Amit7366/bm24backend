import express from 'express';

import { USER_ROLE } from '../User/user.constant';
import { getMyChatRooms } from './chatRoom.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/my', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin), getMyChatRooms);

export const ChatRoomRoutes = router;
