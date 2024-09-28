import { Request, Response, NextFunction } from 'express';
import { UserAuthGuard } from './userAuthGuard';
import { AdminAuthGuard } from './adminAuthGuard';
import { User } from '../models/user';
import { Admin } from '../models/admin';

export const CombinedAuthGuard = (
  req: Request & { user?: User; admin?: Admin },
  res: Response,
  next: NextFunction
) => {
  console.log('CombinedAuthGuard invoked');
  // Try user authentication first
  UserAuthGuard(req, res, (userErr) => {
    if (!userErr && req.user) {
      // User authentication successful
      console.log('User authenticated: ', req.user);
      return next(); // Proceed to next middleware
    }

    // If user authentication fails, try admin authentication
    AdminAuthGuard(req, res, (adminErr) => {
      if (!adminErr && req.admin) {
        // Admin authentication successful
        console.log('Admin authenticated: ', req.admin);
        return next(); // Proceed to next middleware
      }

      // Both user and admin auth failed
      console.error('Authentication failed: ', { userErr, adminErr });
      res.status(401).json({ message: 'Unauthorized' });
    });
  });
};
