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
exports.commentService = void 0;
const comment_1 = require("../models/comment");
class CommentService {
    addComment(content, userId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comment_1.Comment.query().insert({ content, userId, taskId });
        });
    }
    editComment(commentId, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_1.Comment.query().findById(commentId);
            if (!comment)
                throw new Error('Comment not found');
            if (comment.userId !== userId)
                throw new Error('Not authorized to edit this comment');
            return yield comment.$query().patchAndFetch({ content });
        });
    }
    deleteComment(commentId, userId, isAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield comment_1.Comment.query().findById(commentId);
            if (!comment)
                throw new Error('Comment not found');
            if (!isAdmin && comment.userId !== userId)
                throw new Error('Not authorized to delete this comment');
            yield comment_1.Comment.query().deleteById(commentId);
        });
    }
}
exports.commentService = new CommentService();
