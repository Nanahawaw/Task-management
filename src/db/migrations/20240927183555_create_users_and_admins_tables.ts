import { Knex } from 'knex';
import { AdminRole } from '../../utils/enum'; // Adjust the import path based on your project structure

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('isVerified').defaultTo(false); // Add isverified column with default value false
    table.string('verificationToken').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('admins', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();

    // Extract the enum values from the AdminRole enum and pass them to table.enum
    table.enum('role', Object.values(AdminRole)).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('admins');
}
