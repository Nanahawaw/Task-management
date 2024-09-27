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
exports.logout = exports.createAdmin = exports.loginAdmin = exports.loginUser = exports.resendVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const user_1 = require("../models/user");
const admin_1 = require("../models/admin");
const enum_1 = require("../utils/enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const generatePassword_1 = require("../utils/generatePassword");
const registerUser = (email, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.User.query().findOne({ email });
    if (existingUser) {
        return res.status(409).json(`User ${email} already exists, Please log in`);
    }
    const user = yield user_1.User.query().insert({ email, password });
    yield (0, email_1.sendVerificationEmail)(email, user.verificationToken);
    return {
        message: 'User registered successfully, please check your email for verification',
    };
});
exports.registerUser = registerUser;
const verifyEmail = (email, token, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.query().findOne({ email });
    if (!user) {
        return res.status(404).json('User not found');
    }
    if (user.isVerified) {
        return res.status(409).json('User has already been verified');
    }
    if (token === user.verificationToken) {
        yield user_1.User.query().patch({ isVerified: true }).where({ email });
        return {
            message: 'Email verification successful',
        };
    }
    else {
        throw new Error('Invalid verification token');
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.query().findOne({ email, isVerified: false });
    if (!user) {
        throw new Error('User not found or already verified');
    }
    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    yield user_1.User.query().findById(user.id).patch({ verificationToken: newToken });
    yield (0, email_1.sendVerificationEmail)(email, newToken);
    return { message: 'Verification email resent. Please check your inbox.' };
});
exports.resendVerificationEmail = resendVerificationEmail;
const loginUser = (email, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.query().findOne({ email });
    if (!user || !(yield user.verifyPassword(password))) {
        return res.status(401).json('Invalid credentials');
    }
    if (!user.isVerified) {
        return res
            .status(500)
            .json('Email not verified. Please verify your email before logging in.');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return { user };
});
exports.loginUser = loginUser;
const loginAdmin = (email, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_1.Admin.query().findOne({ email });
    if (!admin || !(yield admin.verifyPassword(password))) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    // Set the token as an HTTP-only cookie
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return { message: 'Admin logged in successfully' };
});
exports.loginAdmin = loginAdmin;
const createAdmin = (email, role, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    const creator = yield admin_1.Admin.query().findById(creatorId);
    if (!creator || creator.role !== enum_1.AdminRole.SuperAdmin) {
        throw new Error('Only super admin can create other admins');
    }
    const temporaryPassword = (0, generatePassword_1.generatePassword)(); // Generate a random password
    const admin = yield admin_1.Admin.query().insert({
        email,
        password: yield admin_1.Admin.hashPassword(temporaryPassword),
        role,
    });
    yield (0, email_1.sendAdminInvitationEmail)(email, temporaryPassword, role);
    return admin;
});
exports.createAdmin = createAdmin;
const logout = (res) => {
    res.clearCookie('token');
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
};
exports.logout = logout;
