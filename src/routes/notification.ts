// notificationRoutes.ts

import express from 'express';
import { notificationStorage } from '../notificationStorage';

const router = express.Router();

router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const notifications = notificationStorage.getNotificationsForUser(userId);
  res.json(notifications);
});

export default router;
