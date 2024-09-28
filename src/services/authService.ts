import { User } from '../models/user';
import { Admin } from '../models/admin';
import { AdminRole, ErrorType, UserError } from '../utils/enum';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import {
  sendAdminInvitationEmail,
  sendVerificationEmail,
} from '../utils/email';
import { generatePassword } from '../utils/generatePassword';

export const registerUser = async (email: string, password: string) => {
  const existingUser = await User.query().findOne({ email });
  if (existingUser) {
    throw new Error(UserError.EMAIL_ALREADY_EXISTS);
  }
  const user = await User.query().insert({ email, password });
  await sendVerificationEmail(email, user.verificationToken);
  return {
    message:
      'User registered successfully, please check your email for verification',
  };
};

export const verifyEmail = async (email: string, token: string) => {
  const user = await User.query().findOne({ email });
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  if (user.isVerified) {
    throw new Error(ErrorType.BAD_REQUEST);
  }
  if (token === user.verificationToken) {
    await User.query()
      .patch({ isVerified: true, verificationToken: '' })
      .where({ email });
    return {
      message: 'Email verification successful',
    };
  } else {
    throw new Error(ErrorType.VALIDATION_ERROR);
  }
};

export const resendVerificationEmail = async (email: string) => {
  const user = await User.query().findOne({ email, isVerified: false });
  if (!user) {
    throw new Error(ErrorType.NOT_FOUND);
  }

  const newToken = Math.floor(100000 + Math.random() * 900000).toString();
  await User.query().findById(user.id).patch({ verificationToken: newToken });
  await sendVerificationEmail(email, newToken);

  return { message: 'Verification email resent. Please check your inbox.' };
};

export const loginUser = async (
  email: string,
  password: string,
  res: Response
) => {
  const user = await User.query().findOne({ email });
  if (!user || !(await user.verifyPassword(password))) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  if (!user.isVerified) {
    throw new Error(UserError.UNAUTHORIZED);
  }

  const token = jwt.sign(
    { id: user.id, role: 'user' },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );

  // Set the token as an HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return { message: 'User logged in successfully' };
};

export const loginAdmin = async (
  email: string,
  password: string,
  res: Response
) => {
  const admin = await Admin.query().findOne({ email });
  if (!admin || !(await admin.verifyPassword(password))) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }
  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1d',
    }
  );

  // Set the token as an HTTP-only cookie
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  return { message: 'Admin logged in successfully' };
};

export const createAdmin = async (
  email: string,
  role: AdminRole,
  creatorId: number,
  res: Response
) => {
  const creator = await Admin.query().findById(creatorId);
  if (!creator || creator.role !== AdminRole.SuperAdmin) {
    throw new Error(ErrorType.UNAUTHORIZED);
  }

  const temporaryPassword = generatePassword(); // Generate a random password

  const admin = await Admin.query().insert({
    email,
    password: await Admin.hashPassword(temporaryPassword),
    role,
  });

  await sendAdminInvitationEmail(email, temporaryPassword, role);
  return 'Admin Invitation sent successfully';
};

export const logout = (res: Response) => {
  res.clearCookie('token');
  res.clearCookie('accessToken');
  return { message: 'Logged out successfully' };
};
