import express from 'express';
import * as authController from '../controllers/authController';
import { AdminAuthGuard } from '../middlewares/adminAuthGuard';
import { validateLogin, validateRegistration } from '../middlewares/validation';

const router = express.Router();

router.post('/register', validateRegistration, authController.registerUser);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/login', validateLogin, authController.loginUser);
router.post('/admin/login', validateLogin, authController.loginAdmin);
router.post('/admin/create', AdminAuthGuard, authController.createAdmin);
router.post('/logout', authController.logout);

export default router;
