import express from 'express';
import { Admin } from '../models/admin';
import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { AdminAuthGuard } from '../middlewares/adminAuthGuard';
import { validateLogin, validateRegistration } from '../middlewares/validation';

const router = express.Router();

router.post(
  '/register',
  validateRegistration,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.registerUser(email, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/verify-email',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, token } = req.body;
      const result = await authService.verifyEmail(email, token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/resend-verification',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await authService.resendVerificationEmail(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/login',
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password, res);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/admin/login',
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.loginAdmin(email, password, res);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/admin/create',
  AdminAuthGuard,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, role } = req.body;
      const creatorId = (req as Request & { admin?: Admin }).admin!.id;
      const result = await authService.createAdmin(email, role, creatorId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.clearCookie('accessToken');
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
