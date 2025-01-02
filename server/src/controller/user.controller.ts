import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { paginationFilter } from '../utils';
import { userAPIConstants } from '../lib/constants';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let { name = '', page = 1, limit = 10 } = req.query;

  const { limit: limitValue, offset } = paginationFilter(page as number, limit as number);

  try {
    const users = await prisma.user.findMany({
      take: parseInt(limitValue.toString()),
      skip: offset,
      where: {
        name: {
          contains: name as string,
        },
      },
      omit: {
        id: true,
        password: true,
      },
    });
    const usersCount = await prisma.user.count();
    res.status(200).json({ totalCount: usersCount, data: users });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: userAPIConstants.GLOBAL_ERROR_MESSAGE });
    }
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      },
    });

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: userAPIConstants.GLOBAL_ERROR_MESSAGE });
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const { name, email } = req.body;
    const response = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        name,
        email,
      },
    });
    res.status(200).json({ message: userAPIConstants.USER_UPDATED_MESSAGE });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: userAPIConstants.GLOBAL_ERROR_MESSAGE });
    }
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const user = await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });
    res.status(200).json({ message: userAPIConstants.USER_DELETED_MESSAGE });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: userAPIConstants.GLOBAL_ERROR_MESSAGE });
    }
  }
};
