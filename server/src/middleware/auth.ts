import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const SECRET_KEY: Secret = process.env.TOKEN_SECRET_KEY || 'keyboard-cat';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    (req as CustomRequest).token = decoded;

    next();
  } catch (err) {
    res.status(401).send('Please authenticate');
  }
};

export const generateAccesssToken = (userId: String) => {
  // verify refresh token first
  // logic ...

  return jwt.sign({ userId }, SECRET_KEY, { algorithm: 'ES256', expiresIn: '15 mins' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { algorithm: 'ES256', expiresIn: '30 days' });
};
