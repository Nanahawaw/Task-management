import Knex from 'knex';
import { Model } from 'objection';

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_management',
  },
});
Model.knex(knex);

export default knex;
