import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import {
  subscribeHandler,
  unsubscribeHandler,
  getLogsHandler,
  markAsReadHandler,
  markAllAsReadHandler,
  clearAllNotificationsHandler,
} from "@/controllers/notificationController";

const router = Router();

// Subscribe to notifications (authenticated)
router.post("/subscribe", authenticate(true), subscribeHandler);

// Unsubscribe from notifications (authenticated)
router.post("/unsubscribe", authenticate(true), unsubscribeHandler);

// Get notification logs (authenticated)
router.get("/logs", authenticate(true), getLogsHandler);

// Mark notification as read (authenticated)
router.patch("/:id/read", authenticate(true), markAsReadHandler);

// Mark all notifications as read (authenticated)
router.patch("/read-all", authenticate(true), markAllAsReadHandler);

// Delete all notifications (authenticated)
router.delete("/logs", authenticate(true), clearAllNotificationsHandler);

export default router;
