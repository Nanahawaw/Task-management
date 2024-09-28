// notificationStorage.ts

interface Notification {
  userId: number;
  message: string;
  timestamp: Date;
}

class NotificationStorage {
  private notifications: Notification[] = [];

  addNotification(userId: number, message: string) {
    this.notifications.push({
      userId,
      message,
      timestamp: new Date(),
    });
  }

  getNotificationsForUser(userId: number): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }
}

export const notificationStorage = new NotificationStorage();
