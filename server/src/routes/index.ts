import { Request, Response, Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.route('/').get((req: Request, res: Response) => {
  res.json({ message: 'Welcome to Blog website' });
});

router.use('/users', userRoutes);

export default router;
