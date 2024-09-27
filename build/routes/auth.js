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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService = __importStar(require("../services/authService"));
const adminAuthGuard_1 = require("../middlewares/adminAuthGuard");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.validateRegistration, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.registerUser(email, password, res);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/verify-email', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, token } = req.body;
        const result = yield authService.verifyEmail(email, token, res);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/resend-verification', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const result = yield authService.resendVerificationEmail(email);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/login', validation_1.validateLogin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.loginUser(email, password, res);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/login', validation_1.validateLogin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield authService.loginAdmin(email, password, res);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/admin/create', adminAuthGuard_1.AdminAuthGuard, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, role } = req.body;
        const creatorId = req.admin.id;
        const result = yield authService.createAdmin(email, role, creatorId);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('accessToken');
    res.status(200).json({ message: 'Logged out successfully' });
});
exports.default = router;
