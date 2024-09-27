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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const bcrypt_1 = __importDefault(require("bcrypt"));
const enum_1 = require("../../utils/enum");
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        //delete existing entries if any
        yield knex('admins').del();
        const password = process.env.SUPER_ADMIN_PASSWORD || 'defaultPassword';
        const email = process.env.SUPER_ADMIN_EMAIL || 'defaultEmail@example.com';
        //insert super admin
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield knex('admins').insert({
            email: email,
            password: hashedPassword,
            role: enum_1.AdminRole.SuperAdmin,
        });
    });
}
