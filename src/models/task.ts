import { Model } from 'objection';
import { User } from './user';
import { Comment } from './comment';
import { Tags, TaskStatus } from '../utils/enum';

export class Task extends Model {
  static tableName = 'tasks';

  id!: number;
  title!: string;
  description!: string;
  dueDate!: Date;
  status!: TaskStatus;
  createdById!: number;
  assignedToId!: number;
  tags!: Tags;

  static relationMappings = {
    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tasks.createdById',
        to: 'users.id',
      },
    },
    assignedTo: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'tasks.assignedToId',
        to: 'users.id',
      },
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: Comment,
      join: {
        from: 'tasks.id',
        to: 'comments.taskId',
      },
    },
  };
}
