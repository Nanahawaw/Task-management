// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registrationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract only the first error message
      const errorMessage = error.errors[0]?.message || 'Validation error';
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  }
};
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract only the first error message
      const errorMessage = error.errors[0]?.message || 'Validation error';
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  }
};
