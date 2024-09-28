// notificationRoutes.ts

import express from 'express';
import { Notification } from '../models/notification';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const notifications = await Notification.query()
      .where('userId', userId)
      .orderBy('createdAt', 'desc');
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
