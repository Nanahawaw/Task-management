import type { Knex } from 'knex';
import { Tags, TaskStatus } from '../../utils/enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.date('dueDate').notNullable();
    table.enum('status', Object.values(TaskStatus)).notNullable();
    table
      .integer('createdById')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('assignedToId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.enum('tags', Object.values(Tags)).notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns with timestamps
  });

  await knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.text('content').notNullable();
    table
      .integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('taskId')
      .unsigned()
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE');
    table.timestamps(true, true); // Adds created_at and updated_at columns with timestamps
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks');
  await knex.schema.dropTable('comments');
}
