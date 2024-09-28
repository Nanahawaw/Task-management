import express, { Request, Response, NextFunction } from 'express';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import { taskService, CreateTaskParams } from '../services/taskService';
import { User } from '../models/user';
import { AdminRole, ErrorType, Tags, TaskStatus } from '../utils/enum';
import { Admin } from '../models/admin';

const router = express.Router();

router.post(
  '/',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { title, description, dueDate, tags } = req.body;
      const createdById = (req as Request & { user?: User }).user!.id;

      // Validate that the provided tags value is a valid Tags enum
      if (!Object.values(Tags).includes(tags)) {
        return res.status(400).json({ error: ErrorType.VALIDATION_ERROR });
      }

      // Validate dueDate format
      if (isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ error: ErrorType.VALIDATION_ERROR });
      }

      const taskParams: CreateTaskParams = {
        title,
        description,
        dueDate: new Date(dueDate),
        tags: tags as Tags,
        createdById,
      };

      const task = await taskService.createTask(taskParams);
      // Add return here to ensure the function exits after sending the response
      return res.status(201).json(task);
    } catch (error) {
      // Improved error handling
      console.error('Error creating task:', error);
      return res.status(500).json({
        message: error,
        error: ErrorType.INTERNAL_SERVER_ERROR,
      });
    }
  }
);

router.patch(
  '/:taskId/assign',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { taskId } = req.params;
      const { assignedToId } = req.body;
      const userId = (req as Request & { user?: User }).user!.id;
      const task = await taskService.assignTask(
        Number(taskId),
        assignedToId,
        userId
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:taskId/status',
  async (
    req: Request & { user?: User; admin?: Admin },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      let isAdmin = false;
      let userId: number;

      if (req.admin) {
        // Admin is making the request
        isAdmin =
          req.admin.role === AdminRole.SuperAdmin ||
          req.admin.role === AdminRole.ContentAdmin;
        userId = req.admin.id;
      } else if (req.user) {
        // User is making the request
        userId = req.user.id;
      } else {
        throw new Error('Not authenticated');
      }

      const task = await taskService.updateTaskStatus(
        Number(taskId),
        status as TaskStatus,
        userId,
        isAdmin
      );

      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/tags',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await taskService.getAllTags();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/filter',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tags } = req.query;
      const filteredTasks = await taskService.getTasksByTags(tags as Tags[]);
      res.json(filteredTasks);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
