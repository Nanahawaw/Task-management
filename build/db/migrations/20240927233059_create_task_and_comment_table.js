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
exports.up = up;
exports.down = down;
const enum_1 = require("../../utils/enum");
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable('tasks', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('description').notNullable();
            table.date('dueDate').notNullable();
            table.enum('status', Object.values(enum_1.TaskStatus)).notNullable();
            table
                .integer('createdById')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table
                .integer('assignedToId')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.enum('tags', Object.values(enum_1.Tags)).notNullable();
            table.timestamps(true, true); // Adds created_at and updated_at columns with timestamps
        });
        yield knex.schema.createTable('comments', (table) => {
            table.increments('id').primary();
            table.text('content').notNullable();
            table
                .integer('userId')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table
                .integer('taskId')
                .unsigned()
                .references('id')
                .inTable('tasks')
                .onDelete('CASCADE');
            table.timestamps(true, true); // Adds created_at and updated_at columns with timestamps
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTable('tasks');
        yield knex.schema.dropTable('comments');
    });
}
