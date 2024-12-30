import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let { page = 0, limit = 10 } = req.query;
  page = Math.abs(parseInt(page)) || 0;
  limit = Math.abs(parseInt(limit)) || 10;
  let offset = page * limit;

  try {
    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
      include: {
        posts: true,
        profile: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
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
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;
    const response = await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error?.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};
