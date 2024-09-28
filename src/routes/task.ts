import express from 'express';
import * as taskController from '../controllers/taskController';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import { CombinedAuthGuard } from '../middlewares/authguard';

const router = express.Router();

router.post('/', UserAuthGuard, taskController.createTask);
router.patch('/:taskId/assign', UserAuthGuard, taskController.assignTask);
router.patch(
  '/:taskId/status',
  CombinedAuthGuard,
  taskController.updateTaskStatus
);
router.get('/tags', UserAuthGuard, taskController.getAllTags);
router.get('/filter', UserAuthGuard, taskController.getTasksByTags);

export default router;
