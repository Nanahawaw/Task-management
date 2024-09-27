import { Model } from 'objection';
import bcrypt from 'bcrypt';

export class User extends Model {
  id!: number;
  email!: string;
  password!: string;
  isVerified!: boolean;
  verificationToken!: string;

  static tableName = 'users';

  static async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  async $beforeInsert() {
    this.password = await User.hashedPassword(this.password);
    this.isVerified = false;
    this.verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); //6 digit otp
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
