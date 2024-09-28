import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';
import commentRoutes from './routes/comment';
import noticationRoutes from './routes/notification';
import cookieParser from 'cookie-parser';
import Knex from 'knex';
import { Model } from 'objection';
import { setupWebSocket } from './websockets';

//import knex config
import knexConfig from './knexfile';
import { taskService } from './services/taskService';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = setupWebSocket(httpServer);
//set the websocket instance iin taskservice
taskService.setIo(io);
const PORT = process.env.PORT || 3000;

// Initialize Knex instance
const knex = Knex(knexConfig);

// Bind Knex instance to Objection models
Model.knex(knex);

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', noticationRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
