import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { AdminRole } from '../../utils/enum';

export async function seed(knex: Knex): Promise<void> {
  //delete existing entries if any
  await knex('admins').del();

  const password: string =
    process.env.SUPER_ADMIN_PASSWORD || 'defaultPassword';
  const email: string =
    process.env.SUPER_ADMIN_EMAIL || 'defaultEmail@example.com';

  //insert super admin
  const hashedPassword = await bcrypt.hash(password, 10);
  await knex('admins').insert({
    email: email,
    password: hashedPassword,
    role: AdminRole.SuperAdmin,
  });
}
