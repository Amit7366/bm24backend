import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    id: string;
    role: string;
    email: string;
    objectId: string;
    contactNo: string;
    userName: string;
  },
  secret: string,
  expiresIn: string | number 
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'], 
  };

  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
