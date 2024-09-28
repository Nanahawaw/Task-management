"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const objection_1 = require("objection");
const user_1 = require("./user");
const task_1 = require("./task");
class Comment extends objection_1.Model {
}
exports.Comment = Comment;
Comment.tableName = 'comments';
Comment.relationMappings = {
    user: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: user_1.User,
        join: {
            from: 'comments.userId',
            to: 'users.id',
        },
    },
    task: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: task_1.Task,
        join: {
            from: 'comments.taskId',
            to: 'tasks.id',
        },
    },
};
