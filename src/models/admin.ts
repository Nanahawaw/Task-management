import { Model } from 'objection';

import bcrypt from 'bcrypt';

export class Admin extends Model {
  id!: number;
  email!: string;
  password!: string;
  role!: AdminRole;

  static Role = AdminRole;

  static tableName = 'admins';

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async $beforeInsert() {
    this.password = await Admin.hashPassword(this.password);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
