"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = exports.ErrorType = exports.Tags = exports.TaskStatus = exports.AdminRole = void 0;
var AdminRole;
(function (AdminRole) {
    AdminRole["SuperAdmin"] = "superadmin";
    AdminRole["UserAdmin"] = "useradmin";
    AdminRole["ContentAdmin"] = "contentadmin";
    // Add any other roles you need
})(AdminRole || (exports.AdminRole = AdminRole = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["ToDo"] = "to_do";
    TaskStatus["InProgress"] = "in_progress";
    TaskStatus["Completed"] = "completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var Tags;
(function (Tags) {
    Tags["Urgent"] = "urgent";
    Tags["Bug"] = "bug";
    Tags["Feature"] = "feature";
    // Add any other tags you need
})(Tags || (exports.Tags = Tags = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION_ERROR"] = "Validation Error";
    ErrorType["DATABASE_ERROR"] = "Database Error";
    ErrorType["NOT_FOUND"] = "Not Found";
    ErrorType["INTERNAL_SERVER_ERROR"] = "Internal Server Error";
    ErrorType["UNAUTHORIZED"] = "Unauthorized";
    ErrorType["FORBIDDEN"] = "Forbidden";
    ErrorType["BAD_REQUEST"] = "Bad Request";
    ErrorType["DUPLICATE_TASK_ERROR"] = "Task with same title exists for this user";
    //add more as needed
})(ErrorType || (exports.ErrorType = ErrorType = {}));
var UserError;
(function (UserError) {
    UserError["EMAIL_ALREADY_EXISTS"] = "Email already exists";
    UserError["USER_NOT_FOUND"] = "User not found";
    UserError["WRONG_CREDENTIALS"] = "Wrong credentials";
    UserError["UNAUTHORIZED"] = "Email Verification required";
    // Add any other errors related to user authentication
})(UserError || (exports.UserError = UserError = {}));
