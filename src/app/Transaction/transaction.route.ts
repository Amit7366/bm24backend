// transaction.route.ts
import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { coinWithdrawValidation, depositValidation, withdrawValidation } from './transaction.validation';
import { TransactionController } from './transaction.controller';

const router = express.Router();

router.post('/deposit/manual', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), validateRequest(depositValidation), TransactionController.createManualDeposit);

router.post('/withdraw/manual', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), validateRequest(withdrawValidation), TransactionController.createManualWithdraw);

router.patch('/withdraw/approve/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.approveWithdraw);
router.patch(
  '/coin/withdraw',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin,USER_ROLE.user),
  validateRequest(coinWithdrawValidation),
  TransactionController.approveCoinWithdraw
);


router.patch('/deposit/approve/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.approveDeposit);

router.patch('/reject/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.rejectWithdraw);

router.get('/all', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TransactionController.getAllTransactions);

router.get('/balance/:userId', auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user), TransactionController.getBalance);

export const TransactionRoutes = router;