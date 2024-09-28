import { Task } from '../models/task';
import { User } from '../models/user';
import { Tags, TaskStatus } from '../utils/enum';
import { sendNotification } from '../websockets';
import { Server } from 'socket.io';

export interface CreateTaskParams {
  title: string;
  description: string;
  dueDate: Date;
  tags: Tags;
  createdById: number;
}

export class TaskService {
  private io: Server | null = null;

  //set the websocket server instance
  setIo(io: Server) {
    this.io = io;
  }
  //create a new task
  async createTask(params: CreateTaskParams): Promise<Task> {
    const task = await Task.query().insert(params);
    return task;
  }

  async assignTask(
    taskId: number,
    assignedToId: number,
    userId: number
  ): Promise<Task> {
    const task = await Task.query().findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.createdById !== userId && task.assignedToId !== userId) {
      throw new Error('Not authorized to assign this task');
    }
    const updatedTask = await task.$query().patchAndFetch({ assignedToId });

    //check if the io instance is initialized
    if (this.io) {
      sendNotification(
        this.io,
        assignedToId,
        `You have been assigned a new task: ${task.title}`
      );
    } else {
      console.error('WebSocket server not initialized');
    }

    return updatedTask;
  }

  async updateTaskStatus(
    taskId: number,
    status: TaskStatus,
    userId: number,
    isAdmin: boolean
  ): Promise<Task> {
    const task = await Task.query().findById(taskId);
    if (!task) throw new Error('Task not found');
    if (!isAdmin && task.assignedToId !== userId) {
      throw new Error('Not authorized to update this task');
    }
    return await task.$query().patchAndFetch({ status });
  }

  async getTasksByTags(tags: Tags[]): Promise<Task[]> {
    return await Task.query().whereIn('tags', tags);
  }

  async getAllTags(): Promise<Tags[]> {
    const tasks = await Task.query().select('tags').distinct();
    return tasks.map((task) => task.tags);
  }
}

export const taskService = new TaskService();
