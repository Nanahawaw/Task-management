"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.logout = exports.createAdmin = exports.loginAdmin = exports.loginUser = exports.resendVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const authService = __importStar(require("../services/authService"));
const errorHandler_1 = require("../utils/errorHandler");
const enum_1 = require("../utils/enum");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.registerUser(email, password);
        res.status(201).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.registerUser = registerUser;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token } = req.body;
        const result = yield authService.verifyEmail(email, token);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const result = yield authService.resendVerificationEmail(email);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.loginUser(email, password, res);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.UNAUTHORIZED, error.message);
    }
});
exports.loginUser = loginUser;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.loginAdmin(email, password, res);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.UNAUTHORIZED, error.message);
    }
});
exports.loginAdmin = loginAdmin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = req.body;
        const creatorId = req.admin.id;
        const result = yield authService.createAdmin(email, role, creatorId, res);
        res.status(201).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, enum_1.ErrorType.INTERNAL_SERVER_ERROR, error.message);
    }
});
exports.createAdmin = createAdmin;
const logout = (req, res) => {
    const result = authService.logout(res);
    res.status(200).json(result);
};
exports.logout = logout;
