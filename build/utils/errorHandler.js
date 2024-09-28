"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const enum_1 = require("./enum");
const handleError = (res, type, details) => {
    const statusCodes = {
        [enum_1.ErrorType.VALIDATION_ERROR]: 400,
        [enum_1.ErrorType.DATABASE_ERROR]: 500,
        [enum_1.ErrorType.NOT_FOUND]: 404,
        [enum_1.ErrorType.INTERNAL_SERVER_ERROR]: 500,
        [enum_1.ErrorType.UNAUTHORIZED]: 401,
        [enum_1.ErrorType.FORBIDDEN]: 403,
        [enum_1.ErrorType.BAD_REQUEST]: 400,
        [enum_1.ErrorType.DUPLICATE_TASK_ERROR]: 409,
    };
    return res.status(statusCodes[type]).json({
        error: type,
        message: details || 'An error occurred',
    });
};
exports.handleError = handleError;
