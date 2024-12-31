import { Router } from 'express';
import { deleteUser, getUserById, getUsers, updateUser } from '../controller/user.controller';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.route('/').get(isAuthenticated, getUsers);
router.route('/:id').get(getUserById);
router.route('/:id').put(updateUser);
router.route('/:id').delete(deleteUser);

export default router;
