import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';
import { handleError } from '../utils/errorHandler';
import { ErrorType } from '../utils/enum';
import { Admin } from '../models/admin';
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);
    res.status(201).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, token } = req.body;
    const result = await authService.verifyEmail(email, token);
    res.status(200).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    res.status(200).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, res);
    res.status(200).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.UNAUTHORIZED, error.message);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginAdmin(email, password, res);
    res.status(200).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.UNAUTHORIZED, error.message);
  }
};

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, role } = req.body;
    const creatorId = (req as Request & { admin?: Admin }).admin!.id;
    const result = await authService.createAdmin(email, role, creatorId, res);
    res.status(201).json(result);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const logout = (req: Request, res: Response) => {
  const result = authService.logout(res);
  res.status(200).json(result);
};
