import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import { createMessage, getMessages } from './message.controller';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/createMessage', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), createMessage);
router.get('/getMessages/:roomId', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), getMessages);

export const MessageRoutes = router;
