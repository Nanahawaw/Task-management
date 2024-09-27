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
exports.sendAdminInvitationEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT), // Convert to number
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
const sendVerificationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email address',
        text: `Your verification code is: ${token}`,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendAdminInvitationEmail = (email, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Admin Account Has Been Created',
        text: `
Hello,

An admin account has been created for you with the following details:

Email: ${email}
Temporary Password: ${password}
Role: ${role}

Please log in to your account and change your password immediately.


If you have any questions, please contact the super admin.

Best regards,
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log('Admin invitation email sent successfully');
    }
    catch (error) {
        console.error('Error sending admin invitation email:', error);
        throw new Error('Failed to send admin invitation email');
    }
});
exports.sendAdminInvitationEmail = sendAdminInvitationEmail;
