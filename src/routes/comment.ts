import express, { Request, Response, NextFunction } from 'express';
import { AdminAuthGuard } from '../middlewares/adminAuthGuard';
import { UserAuthGuard } from '../middlewares/userAuthGuard';
import { commentService } from '../services/commentService';
import { User } from '../models/user';
import { AdminRole } from '../utils/enum';
import { Admin } from '../models/admin';

const router = express.Router();

router.post(
  '/',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content, taskId } = req.body;
      const userId = (req as Request & { user?: User }).user!.id;
      const comment = await commentService.addComment(content, userId, taskId);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:commentId',
  UserAuthGuard,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = (req as Request & { user?: User }).user!.id;
      const comment = await commentService.editComment(
        Number(commentId),
        content,
        userId
      );
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:commentId',
  async (
    req: Request & { user?: User; admin?: Admin },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;

      let isAdmin = false;
      let userId: number;

      if (req.admin) {
        // Admin is making the request
        isAdmin =
          req.admin.role === AdminRole.SuperAdmin ||
          req.admin.role === AdminRole.ContentAdmin;
        userId = req.admin.id; // Admin ID
      } else if (req.user) {
        // Regular user is making the request
        userId = req.user.id; // User ID
      } else {
        throw new Error('Not authenticated');
      }

      // Call the service method with userId and isAdmin flag
      await commentService.deleteComment(Number(commentId), userId, isAdmin);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
