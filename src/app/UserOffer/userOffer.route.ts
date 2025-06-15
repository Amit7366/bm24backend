import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { createUserOfferValidation, updateUserOfferValidation } from './userOffer.validation';
import { UserOfferController } from './userOffer.controller';
const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(createUserOfferValidation),
  UserOfferController.createUserOffer
);

router.get('/all', auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserOfferController.getAllUserOffers);

router.get('/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserOfferController.getSingleUserOffer);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateUserOfferValidation),
  UserOfferController.updateUserOffer
);

router.delete('/:id', auth(USER_ROLE.admin, USER_ROLE.superAdmin), UserOfferController.deleteUserOffer);

export const UserOfferRoutes = router;
