import { Model } from 'objection';
import { User } from './user';

export class Notification extends Model {
  id!: number;
  userId!: number;
  message!: string;
  isRead!: boolean;
  createdAt!: Date;

  static tableName = 'notifications';

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'notifications.userId',
        to: 'users.id',
      },
    },
  };
}
