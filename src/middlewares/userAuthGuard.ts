import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Request, Response, NextFunction } from 'express';

interface UserAuthRequest extends Request {
  user?: User;
}

export const UserAuthGuard = async (
  req: UserAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ error: 'Aunthentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const user = await User.query().findById(decoded.id);
    if (!user) throw new Error('User not found');
    (req as Request & { user?: User }).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};
