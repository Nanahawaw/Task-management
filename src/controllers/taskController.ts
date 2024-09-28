import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { User } from '../models/user';
import { Admin } from '../models/admin';
import { ErrorType, Tags, TaskStatus } from '../utils/enum';
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
  req: Request & { user?: User },
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    let userId: number;
    if (req.user) {
      userId = req.user.id;
      console.log('User ID: ', userId);
    } else {
      handleError(res, ErrorType.UNAUTHORIZED, 'Not authenticated');
      return;
    }

    // Validate the status
    if (!Object.values(TaskStatus).includes(status)) {
      handleError(res, ErrorType.BAD_REQUEST, 'Invalid status');
      return;
    }
    //update the task
    const task = await taskService.updateTaskStatus(
      Number(taskId),
      status as TaskStatus,
      userId
    );
    res.json(task);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const updateTaskStatusAsAdmin = async (
  req: Request & { admin?: Admin },
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const adminId = req.admin!.id;

    // Validate status
    if (!Object.values(TaskStatus).includes(status)) {
      handleError(res, ErrorType.BAD_REQUEST, 'Invalid status');
      return;
    }

    // Update the task as admin
    const task = await taskService.updateTaskStatus(
      Number(taskId),
      status,
      adminId
    );
    res.json(task);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      tags,
      sortBy = 'dueDate',
      order = 'asc',
    } = req.query;

    //convert query params
    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const taskStatus = status as string | undefined;
    const taskTags = tags as string | undefined;
    const sortOrder =
      (order as string).toLowerCase() === 'desc' ? 'desc' : 'asc';

    //validate sortBy
    const validSortColumns = [
      'dueDate',
      'createdAt',
      'updatedAt',
      'status',
      'descsription',
      'title',
      'tags',
    ];
    const sortColumn = validSortColumns.includes(sortBy as string)
      ? (sortBy as string)
      : 'dueDate';
    const tasks = await taskService.getTasksByTags({
      page: pageNum,
      limit: pageSize,
      status: taskStatus,
      tags: taskTags,
      sortBy: sortColumn,
      order: sortOrder,
    });

    res.json(tasks);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};
