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
const enum_1 = require("../../utils/enum"); // Adjust the import path based on your project structure
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.boolean('isVerified').defaultTo(false); // Add isverified column with default value false
            table.string('verificationToken').nullable();
            table.timestamps(true, true);
        });
        yield knex.schema.createTable('admins', (table) => {
            table.increments('id').primary();
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            // Extract the enum values from the AdminRole enum and pass them to table.enum
            table.enum('role', Object.values(enum_1.AdminRole)).notNullable();
            table.timestamps(true, true);
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTable('users');
        yield knex.schema.dropTable('admins');
    });
}
