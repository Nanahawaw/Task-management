"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController = __importStar(require("../controllers/taskController"));
const userAuthGuard_1 = require("../middlewares/userAuthGuard");
const adminAuthGuard_1 = require("../middlewares/adminAuthGuard");
const router = express_1.default.Router();
router.post('/', userAuthGuard_1.UserAuthGuard, taskController.createTask);
router.patch('/:taskId/assign', userAuthGuard_1.UserAuthGuard, taskController.assignTask);
router.patch('/:taskId/status', userAuthGuard_1.UserAuthGuard, taskController.updateTaskStatus);
// Admin specific route to update task status
router.patch('/admin/:taskId/status', adminAuthGuard_1.AdminAuthGuard, // Use only AdminAuthGuard here
taskController.updateTaskStatusAsAdmin);
router.get('/', userAuthGuard_1.UserAuthGuard, taskController.getTasks);
exports.default = router;
