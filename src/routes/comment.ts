import express from 'express';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import * as commentController from '../controllers/commentController';
import { AdminAuthGuard } from '../middlewares/adminAuthGuard';

const router = express.Router();

router.post('/:taskId', UserAuthGuard, commentController.addComment);
router.patch('/:commentId', UserAuthGuard, commentController.editComment);
router.delete('/:commentId', UserAuthGuard, commentController.deleteComment);

router.delete(
  '/admin/:commentId',
  AdminAuthGuard,
  commentController.adminDeleteComment
);

export default router;
