"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = exports.TaskService = void 0;
const task_1 = require("../models/task");
const enum_1 = require("../utils/enum");
const websockets_1 = require("../websockets");
class TaskService {
    constructor() {
        this.io = null;
    }
    setIo(io) {
        this.io = io;
    }
    createTask(title, description, dueDate, tags, createdById) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(enum_1.Tags).includes(tags)) {
                throw new Error(enum_1.ErrorType.VALIDATION_ERROR);
            }
            if (isNaN(Date.parse(dueDate))) {
                throw new Error(enum_1.ErrorType.VALIDATION_ERROR);
            }
            // Check if the user already has a task with the same title
            const existingTask = yield task_1.Task.query().findOne({
                title,
                createdById,
            });
            if (existingTask) {
                // Throw an error indicating that a task with the same title already exists
                throw new Error(enum_1.ErrorType.DUPLICATE_TASK_ERROR); // Create a new error type for this
            }
            const task = yield task_1.Task.query().insert({
                title,
                description,
                dueDate: new Date(dueDate),
                tags: tags,
                createdById,
            });
            return task;
        });
    }
    assignTask(taskId, assignedToId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //find task by id
            const task = yield task_1.Task.query().findById(taskId);
            if (!task)
                throw new Error(enum_1.ErrorType.NOT_FOUND);
            //check if the user is authorized to assign the task
            if (task.createdById !== userId) {
                throw new Error(enum_1.ErrorType.UNAUTHORIZED);
            }
            const updatedTask = yield task
                .$query()
                .patchAndFetch({ assignedToId: assignedToId });
            //notified the assigned user if websocket is initialized
            if (this.io) {
                (0, websockets_1.sendNotification)(this.io, assignedToId, `You have been assigned a new task: ${task.title}`);
            }
            else {
                console.error('WebSocket server not initialized');
            }
            return updatedTask;
        });
    }
    updateTaskStatus(taskId, status, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield task_1.Task.query().findById(taskId);
            if (!task)
                throw new Error(enum_1.ErrorType.NOT_FOUND);
            //task owners and assignees can update status of task
            if (task.createdById === userId || task.assignedToId === userId) {
                return yield task.$query().patchAndFetch({ status });
            }
            throw new Error(enum_1.ErrorType.UNAUTHORIZED);
        });
    }
    getTasksByTags(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page, limit, status, tags, sortBy, order, }) {
            let query = task_1.Task.query().withGraphFetched('comments');
            //filter by status if provided
            if (status) {
                query = query.where('status', status);
            }
            //by tags
            if (tags) {
                query = query.where('tags', tags);
            }
            // Apply sorting only if sortBy is defined and valid
            if (sortBy && order) {
                query = query.orderBy(sortBy, order);
            }
            else {
                // Use default sorting by dueDate in ascending order if not provided
                query = query.orderBy('dueDate', 'asc');
            }
            // Apply pagination
            const paginatedResult = yield query.page(page - 1, limit);
            return paginatedResult;
        });
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
