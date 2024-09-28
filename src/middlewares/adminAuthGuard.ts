import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin';
import { Request, Response, NextFunction } from 'express';

interface AdminAuthRequest extends Request {
  admin?: Admin;
}

export const AdminAuthGuard = async (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.accessToken;
  if (!token) {
    res
      .status(401)
      .json({ message: 'Authentication required, you need to login' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };
    const admin = await Admin.query().findById(decoded.id);
    if (!admin) throw new Error('Admin not found');
    (req as Request & { admin?: Admin }).admin = admin;
    console.log('AdminAuthGuard: Admin authenticated', req.admin);

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
