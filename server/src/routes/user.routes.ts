import { Router } from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controller/user.controller';

const router = Router();

router.route('/').get(getUsers);
router.route('/').post(createUser);
router.route('/:id').put(updateUser);
router.route('/:id').delete(deleteUser);

export default router;
