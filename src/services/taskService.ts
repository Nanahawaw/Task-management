import { Task } from '../models/task';
import { Tags, TaskStatus } from '../utils/enum';

export interface CreateTaskParams {
  title: string;
  description: string;
  dueDate: Date;
  assignedToId: number;
  tags: Tags;
  createdById: number;
}

class TaskService {
  async createTask(params: CreateTaskParams) {
    const { title, description, dueDate, assignedToId, tags, createdById } =
      params;

    const task = await Task.query().insert({
      title,
      description,
      dueDate,
      status: TaskStatus.ToDo,
      createdById,
      assignedToId,
      tags,
    });

    return task;
  }
}

export const taskService = new TaskService();
