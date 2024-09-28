import { Task } from '../models/task';
import { Tags, TaskStatus, ErrorType } from '../utils/enum';
import { sendNotification } from '../websockets';
import { Server } from 'socket.io';

export class TaskService {
  private io: Server | null = null;

  setIo(io: Server) {
    this.io = io;
  }

  async createTask(
    title: string,
    description: string,
    dueDate: string,
    tags: Tags,
    createdById: number
  ) {
    if (!Object.values(Tags).includes(tags)) {
      throw new Error(ErrorType.VALIDATION_ERROR);
    }

    if (isNaN(Date.parse(dueDate))) {
      throw new Error(ErrorType.VALIDATION_ERROR);
    }

    // Check if the user already has a task with the same title
    const existingTask = await Task.query().findOne({
      title,
      createdById,
    });

    if (existingTask) {
      // Throw an error indicating that a task with the same title already exists
      throw new Error(ErrorType.DUPLICATE_TASK_ERROR); // Create a new error type for this
    }
    const task = await Task.query().insert({
      title,
      description,
      dueDate: new Date(dueDate),
      tags: tags as Tags,
      createdById,
    });
    return task;
  }

  async assignTask(taskId: number, assignedToId: number, userId: number) {
    //find task by id
    const task = await Task.query().findById(taskId);
    if (!task) throw new Error(ErrorType.NOT_FOUND);
    //check if the user is authorized to assign the task
    if (task.createdById !== userId) {
      throw new Error(ErrorType.UNAUTHORIZED);
    }
    const updatedTask = await task
      .$query()
      .patchAndFetch({ assignedToId: assignedToId });

    //notified the assigned user if websocket is initialized
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
    userId: number
  ): Promise<Task> {
    const task = await Task.query().findById(taskId);
    if (!task) throw new Error(ErrorType.NOT_FOUND);

    //task owners and assignees can update status of task

    if (task.createdById === userId || task.assignedToId === userId) {
      return await task.$query().patchAndFetch({ status });
    }
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  async getTasksByTags(tags: Tags[]): Promise<Task[]> {
    return await Task.query().whereIn('tags', tags);
  }
}

export const taskService = new TaskService();
