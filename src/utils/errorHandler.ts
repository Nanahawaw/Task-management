import { Response } from 'express';
import { ErrorType } from './enum';

export const handleError = (
  res: Response,
  type: ErrorType,
  details?: string
): Response => {
  const statusCodes: Record<ErrorType, number> = {
    [ErrorType.VALIDATION_ERROR]: 400,
    [ErrorType.DATABASE_ERROR]: 500,
    [ErrorType.NOT_FOUND]: 404,
    [ErrorType.INTERNAL_SERVER_ERROR]: 500,
    [ErrorType.UNAUTHORIZED]: 401,
    [ErrorType.FORBIDDEN]: 403,
    [ErrorType.BAD_REQUEST]: 400,
  };
  return res.status(statusCodes[type]).json({
    error: type,
    message: details || 'An error occurred',
  });
};
