import { Response, Router } from 'express';
import userRoutes from './user.routes';
import postRoutes from './post.routes';
import authRoutes from './auth.routes';

const router = Router();

router.route('/').get((_, res: Response) => {
  res.json({ message: 'Welcome to Blog website' });
});

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/auth', authRoutes);

export default router;
