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
exports.getTasks = exports.updateTaskStatusAsAdmin = exports.updateTaskStatus = exports.assignTask = exports.createTask = void 0;
const taskService_1 = require("../services/taskService");
const enum_1 = require("../utils/enum");
const errorHandler_1 = require("../utils/errorHandler");
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, dueDate, tags } = req.body;
        const createdById = req.user.id;
        if (!Object.values(enum_1.Tags).includes(tags)) {
            (0, errorHandler_1.handleError)(res, enum_1.ErrorType.VALIDATION_ERROR, 'Invalid tags');
            return;
        }
        if (isNaN(Date.parse(dueDate))) {
            (0, errorHandler_1.handleError)(res, enum_1.ErrorType.VALIDATION_ERROR, 'Invalid due date');
            return;
        }
        const task = yield taskService_1.taskService.createTask(title, description, dueDate, tags, createdById);
        res.status(201).json(task);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.createTask = createTask;
const assignTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { assignedToId } = req.body;
        const userId = req.user.id;
        const task = yield taskService_1.taskService.assignTask(Number(taskId), assignedToId, userId);
        res.json(task);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.assignTask = assignTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        let userId;
        if (req.user) {
            userId = req.user.id;
            console.log('User ID: ', userId);
        }
        else {
            (0, errorHandler_1.handleError)(res, enum_1.ErrorType.UNAUTHORIZED, 'Not authenticated');
            return;
        }
        // Validate the status
        if (!Object.values(enum_1.TaskStatus).includes(status)) {
            (0, errorHandler_1.handleError)(res, enum_1.ErrorType.BAD_REQUEST, 'Invalid status');
            return;
        }
        //update the task
        const task = yield taskService_1.taskService.updateTaskStatus(Number(taskId), status, userId);
        res.json(task);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.updateTaskStatus = updateTaskStatus;
const updateTaskStatusAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const adminId = req.admin.id;
        // Validate status
        if (!Object.values(enum_1.TaskStatus).includes(status)) {
            (0, errorHandler_1.handleError)(res, enum_1.ErrorType.BAD_REQUEST, 'Invalid status');
            return;
        }
        // Update the task as admin
        const task = yield taskService_1.taskService.updateTaskStatus(Number(taskId), status, adminId);
        res.json(task);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.updateTaskStatusAsAdmin = updateTaskStatusAsAdmin;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, status, tags, sortBy = 'dueDate', order = 'asc', } = req.query;
        //convert query params
        const pageNum = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const taskStatus = status;
        const taskTags = tags;
        const sortOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
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
        const sortColumn = validSortColumns.includes(sortBy)
            ? sortBy
            : 'dueDate';
        const tasks = yield taskService_1.taskService.getTasksByTags({
            page: pageNum,
            limit: pageSize,
            status: taskStatus,
            tags: taskTags,
            sortBy: sortColumn,
            order: sortOrder,
        });
        res.json(tasks);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.getTasks = getTasks;
