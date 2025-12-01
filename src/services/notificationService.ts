import { Types } from "mongoose";
import { Notification, NotificationLog } from "@/models/Notification";

export interface SubscribeNotificationPayload {
  token: string;
  userId: string;
  role: "admin" | "employee" | "client";
}

export const subscribeToNotifications = async (
  payload: SubscribeNotificationPayload
) => {
  const { token, userId, role } = payload;

  // Check if token already exists
  const existing = await Notification.findOne({ fcmToken: token });

  if (existing) {
    // Update existing notification
    existing.userId = new Types.ObjectId(userId);
    existing.role = role;
    return await existing.save();
  }

  // Create new notification subscription
  const notification = new Notification({
    userId: new Types.ObjectId(userId),
    role,
    fcmToken: token,
  });

  return await notification.save();
};

export const unsubscribeFromNotifications = async (token: string) => {
  return await Notification.findOneAndDelete({ fcmToken: token });
};

export const getNotificationTokens = async (
  filters: {
    userId?: string;
    role?: "admin" | "employee" | "client";
  } = {}
) => {
  const query: any = {};

  if (filters.userId) {
    query.userId = new Types.ObjectId(filters.userId);
  }

  if (filters.role) {
    query.role = filters.role;
  }

  const notifications = await Notification.find(query).lean();
  return notifications.map((n) => n.fcmToken);
};

export const createNotificationLog = async (payload: {
  userId: string;
  role: "admin" | "employee" | "client";
  title: string;
  body: string;
  data?: any;
}) => {
  const log = new NotificationLog({
    userId: new Types.ObjectId(payload.userId),
    role: payload.role,
    title: payload.title,
    body: payload.body,
    data: payload.data,
  });

  return await log.save();
};

export const getNotificationLogs = async (
  userId: string,
  filters: { read?: boolean; limit?: number } = {}
) => {
  const query: any = {
    userId: new Types.ObjectId(userId),
  };

  if (filters.read !== undefined) {
    query.read = filters.read;
  }

  const logs = await NotificationLog.find(query)
    .sort({ createdAt: -1 })
    .limit(filters.limit || 50)
    .lean();

  return logs;
};

export const markNotificationAsRead = async (logId: string, userId: string) => {
  const log = await NotificationLog.findOne({
    _id: logId,
    userId: new Types.ObjectId(userId),
  });

  if (!log) {
    throw new Error("Notification log not found");
  }

  log.read = true;
  return await log.save();
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return await NotificationLog.updateMany(
    {
      userId: new Types.ObjectId(userId),
      read: false,
    },
    {
      $set: { read: true },
    }
  );
};

export const clearAllNotifications = async (userId: string) => {
  return await NotificationLog.deleteMany({
    userId: new Types.ObjectId(userId),
  });
};
