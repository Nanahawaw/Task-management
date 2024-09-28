import express from 'express';
import { AdminAuthGuard } from './adminAuthGuard';
import { UserAuthGuard } from './userAuthGuard';

// Combine UserAuthGuard and AdminAuthGuard
export const CombinedAuthGuard = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  AdminAuthGuard(req, res, (adminErr) => {
    if (!adminErr) {
      (req as any).isAdmin = true;
      return next();
    }
    UserAuthGuard(req, res, (userErr) => {
      if (!userErr) {
        (req as any).isAdmin = false;
        return next();
      }
      next(userErr);
    });
  });
};
