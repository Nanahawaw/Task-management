import express, { Request, Response, NextFunction } from 'express';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import { taskService, CreateTaskParams } from '../services/taskService';
import { User } from '../models/user';
import { Tags } from '../utils/enum';

const router = express.Router();

router.post(
  '/',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, dueDate, assignedToId, tags } = req.body;
      const createdById = (req as Request & { user?: User }).user!.id;

      // Validate that the provided tags value is a valid Tags enum
      if (!Object.values(Tags).includes(tags)) {
        res.status(400).json({ error: 'Invalid tags value' });
        return;
      }

      const taskParams: CreateTaskParams = {
        title,
        description,
        dueDate: new Date(dueDate),
        assignedToId,
        tags: tags as Tags,
        createdById,
      };
      const task = await taskService.createTask(taskParams);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
