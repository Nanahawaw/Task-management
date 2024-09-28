"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const objection_1 = require("objection");
const user_1 = require("./user");
const comment_1 = require("./comment");
class Task extends objection_1.Model {
}
exports.Task = Task;
Task.tableName = 'tasks';
Task.relationMappings = {
    createdBy: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: user_1.User,
        join: {
            from: 'tasks.createdById',
            to: 'users.id',
        },
    },
    assignedTo: {
        relation: objection_1.Model.BelongsToOneRelation,
        modelClass: user_1.User,
        join: {
            from: 'tasks.assignedToId',
            to: 'users.id',
        },
    },
    comments: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: comment_1.Comment,
        join: {
            from: 'tasks.id',
            to: 'comments.taskId',
        },
    },
};
