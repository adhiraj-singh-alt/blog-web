import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { paginationFilter } from '../utils';
import { userAPIConstants } from '../lib/constants';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  let { page = 1, limit = 10 } = req.query;

  const { limit: limitValue, offset } = paginationFilter(page as number, limit as number);

  try {
    const users = await prisma.user.findMany({
      take: parseInt(limitValue),
      skip: offset,

      include: {
        posts: true,
        profile: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
    const usersCount = await prisma.user.count();

    res.status(200).json({ totalCount: usersCount, data: users });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, posts } = req.body;
    console.log(posts);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        posts: {
          create: posts.map((post: { title: string; content?: string }) => ({
            title: post.title,
            content: post.content || null, // If content is missing, set it as null
          })),
        },
      },
      include: {
        posts: true,
      },
    });
    res.status(201).json({ message: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const response = await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });
    res.status(200).json({ message: userAPIConstants.USER_DELETED_MESSAGE });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
