import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { User } from '../models/user';
import { Admin } from '../models/admin';
import { AdminRole, ErrorType, Tags, TaskStatus } from '../utils/enum';
import { handleError } from '../utils/errorHandler';

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, dueDate, tags } = req.body;
    const createdById = (req as Request & { user?: User }).user!.id;

    if (!Object.values(Tags).includes(tags)) {
      handleError(res, ErrorType.VALIDATION_ERROR, 'Invalid tags');
      return;
    }

    if (isNaN(Date.parse(dueDate))) {
      handleError(res, ErrorType.VALIDATION_ERROR, 'Invalid due date');
      return;
    }

    const task = await taskService.createTask(
      title,
      description,
      dueDate,
      tags as Tags,
      createdById
    );
    res.status(201).json(task);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const assignTask = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateTaskStatus = async (
  req: Request & { user?: User; admin?: Admin },
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    let isAdmin = false;
    let userId: number;

    //determine if the user is an admin or reqular user
    if (req.admin) {
      isAdmin =
        req.admin.role === AdminRole.SuperAdmin ||
        req.admin.role === AdminRole.ContentAdmin;
      userId = req.admin.id;
    } else if (req.user) {
      userId = req.user.id;
    } else {
      handleError(res, ErrorType.UNAUTHORIZED, 'Not authenticated');
      return;
    }
    //update the task
    const task = await taskService.updateTaskStatus(
      Number(taskId),
      status as TaskStatus,
      userId,
      isAdmin
    );
    res.json(task);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getAllTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await taskService.getAllTags();
    res.json(tags);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getTasksByTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tags } = req.query;
    const filteredTasks = await taskService.getTasksByTags(tags as Tags[]);
    res.json(filteredTasks);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};
