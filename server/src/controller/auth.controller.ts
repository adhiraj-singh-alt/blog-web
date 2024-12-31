import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { userAPIConstants } from '../lib/constants';
import { loginSchema, userSchema } from '../schemas/userSchema';
import { AppError } from '../middleware/errorHandler';
import { hashPassword, verifyPassword } from '../utils/hashUtils';
import jwt from 'jsonwebtoken';

dotenv.config();
const prisma = new PrismaClient();

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = userSchema.parse(req.body);

    const hashedPassword = hashPassword(user.password);

    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyExists) {
      throw new AppError('User already exists', 409);
    }

    const { password, ...newUser } = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: newUser });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedUser = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: validatedUser.email,
      },
    });

    if (!user) {
      throw new AppError(userAPIConstants.USER_NOT_FOUND_MESSAGE, 404);
    }

    const isPasswordCorrect = verifyPassword(validatedUser.password, user.password);

    if (!isPasswordCorrect) {
      throw new AppError(userAPIConstants.USER_INCORRECT_PASSWORD_MESSAGE, 404);
    }
    console.log(user);
    const { password, ...userData } = user;
    const token = jwt.sign({ email: userData.email }, process.env.TOKEN_SECRET as string, {
      expiresIn: '2 days',
    });
    console.log(token);
    res.status(200).json({ user: userData, token });
  } catch (error) {
    next(error);
  }
};
