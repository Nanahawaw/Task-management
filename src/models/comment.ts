import { Model } from 'objection';
import { User } from './user';
import { Task } from './task';

export class Comment extends Model {
  static tableName = 'comments';

  id!: number;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: number;
  taskId!: number;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'comments.userId',
        to: 'users.id',
      },
    },
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: Task,
      join: {
        from: 'comments.taskId',
        to: 'tasks.id',
      },
    },
  };
}
