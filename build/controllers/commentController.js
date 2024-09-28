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
exports.adminDeleteComment = exports.deleteComment = exports.editComment = exports.addComment = void 0;
const commentService_1 = require("../services/commentService");
const enum_1 = require("../utils/enum");
const errorHandler_1 = require("../utils/errorHandler");
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.taskId, 10);
        const { content } = req.body;
        const userId = req.user.id;
        const comment = yield commentService_1.commentService.addComment(content, userId, taskId);
        res.status(201).json(comment);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.addComment = addComment;
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const comment = yield commentService_1.commentService.editComment(Number(commentId), content, userId);
        res.json(comment);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.editComment = editComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        const userId = req.user.id;
        yield commentService_1.commentService.deleteComment(commentId, userId, false);
        res.status(201).send('Comment deleted successfully');
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
        console.log(error);
    }
});
exports.deleteComment = deleteComment;
const adminDeleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        const userId = req.admin.id;
        yield commentService_1.commentService.deleteComment(commentId, userId, true);
        res.status(201).send('Comment deleted successfully');
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.adminDeleteComment = adminDeleteComment;
