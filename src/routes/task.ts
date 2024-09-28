import express from 'express';
import * as taskController from '../controllers/taskController';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import { AdminAuthGuard } from '../middlewares/adminAuthGuard';

const router = express.Router();

router.post('/', UserAuthGuard, taskController.createTask);
router.patch('/:taskId/assign', UserAuthGuard, taskController.assignTask);
router.patch('/:taskId/status', UserAuthGuard, taskController.updateTaskStatus);

// Admin specific route to update task status
router.patch(
  '/admin/:taskId/status',
  AdminAuthGuard, // Use only AdminAuthGuard here
  taskController.updateTaskStatusAsAdmin
);
router.get('/', UserAuthGuard, taskController.getTasks);

export default router;
