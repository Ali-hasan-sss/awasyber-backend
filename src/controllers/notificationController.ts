import { Request, Response } from "express";
import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
  getNotificationLogs,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "@/services/notificationService";

export const subscribeHandler = async (req: Request, res: Response) => {
  try {
    const { token, userId, role } = req.body;

    if (!token || !userId || !role) {
      return res.status(400).json({
        success: false,
        message: "Token, userId, and role are required",
      });
    }

    await subscribeToNotifications({ token, userId, role });

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to notifications",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to subscribe to notifications",
    });
  }
};

export const unsubscribeHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    await unsubscribeFromNotifications(token);

    return res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from notifications",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to unsubscribe from notifications",
    });
  }
};

export const getLogsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { read, limit } = req.query;

    const logs = await getNotificationLogs(userId, {
      read: read === "true" ? true : read === "false" ? false : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get notification logs",
    });
  }
};

export const markAsReadHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    await markNotificationAsRead(id, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark notification as read",
    });
  }
};

export const markAllAsReadHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark all notifications as read",
    });
  }
};

export const clearAllNotificationsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await clearAllNotifications(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications deleted",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete notifications",
    });
  }
};
