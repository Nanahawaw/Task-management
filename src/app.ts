import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';
import commentRoutes from './routes/comment';
import tagRoutes from './routes/tag';
import notificationRoutes from './routes/notification';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import { Model } from 'objection';

//import knex config
import knexConfig from './knexfile';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Knex instance
const knex = Knex(knexConfig);

// Bind Knex instance to Objection models
Model.knex(knex);

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
