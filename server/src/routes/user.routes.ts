import { Router } from 'express';
import { deleteUser, getUserById, getUsers, updateUser } from '../controller/user.controller';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.route('/').get(getUsers);
router.route('/:userId').get(getUserById);
router.route('/:userId').put(updateUser);
router.route('/:userId').delete(deleteUser);

export default router;
