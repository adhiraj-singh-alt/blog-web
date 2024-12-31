import { Router } from 'express';
import { createPost, deletePost, getPostById, getPosts, updatePost } from '../controller/post.controller';

const router = Router();

router.route('/').get(getPosts);
router.route('/:id').get(getPostById);
router.route('/:userId').post(createPost);
router.route('/:id').put(updatePost);
router.route('/:id').delete(deletePost);

export default router;
