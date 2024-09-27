import nodemailer from 'nodemailer';
import { AdminRole } from './enum';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendAdminInvitationEmail = async (
  email: string,
  password: string,
  role: AdminRole
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Admin Account Has Been Created',
    text: `
Hello,

An admin account has been created for you with the following details:

Email: ${email}
Temporary Password: ${password}
Role: ${role}

Please log in to your account and change your password immediately.


If you have any questions, please contact the super admin.

Best regards,
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin invitation email sent successfully');
  } catch (error) {
    console.error('Error sending admin invitation email:', error);
    throw new Error('Failed to send admin invitation email');
  }
};
