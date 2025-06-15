import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';

import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utilis/catchAsync';
import AppError from '../errors/AppError';
import { TUserRole } from '../User/user.interface';
import mongoose from 'mongoose';

const auth = (...required_Rules: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access', '');
    }

    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Unauthorized Access',
            '',
          );
        }
        const role = (decoded as JwtPayload).role;
        if (required_Rules && !required_Rules.includes(role)) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Unauthorized Access',
            '',
          );
        }
        // use any 
        req.user = decoded as JwtPayload; 
        const user = decoded as JwtPayload;
        // req.user = { ...user, objectId: new mongoose.Types.ObjectId(user.objectId) };
        if (!mongoose.Types.ObjectId.isValid(user.objectId)) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthoriesed');
        }
        // use any 
        req.user = { 
          ...user, 
          objectId: mongoose.Types.ObjectId.createFromHexString(user.objectId) // Use createFromHexString
        };
        console.log('from auth.ts -51 line ', req.user);

        next();
      },
    );
  });
};

export default auth;
