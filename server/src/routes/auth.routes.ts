import { Router } from 'express';
import { loginUser, signUpUser } from '../controller/auth.controller';

const router = Router();

router.route('/login').post(loginUser);
router.route('/signup').post(signUpUser);

export default router;
