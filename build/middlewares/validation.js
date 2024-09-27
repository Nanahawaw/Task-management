"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegistration = void 0;
const zod_1 = require("zod");
const registrationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const validateRegistration = (req, res, next) => {
    var _a;
    try {
        registrationSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Extract only the first error message
            const errorMessage = ((_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.message) || 'Validation error';
            res.status(400).json({ error: errorMessage });
        }
        else {
            res.status(400).json({ error: 'Invalid input' });
        }
    }
};
exports.validateRegistration = validateRegistration;
const validateLogin = (req, res, next) => {
    var _a;
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Extract only the first error message
            const errorMessage = ((_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.message) || 'Validation error';
            res.status(400).json({ error: errorMessage });
        }
        else {
            res.status(400).json({ error: 'Invalid input' });
        }
    }
};
exports.validateLogin = validateLogin;
