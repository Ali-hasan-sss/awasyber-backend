import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import {
  createContactMessage,
  getContactMessages,
  getContactMessage,
  markAsRead,
  deleteContactMessage,
  getUnreadCount,
} from "@/controllers/contactController";

const router = Router();

// Public route - create contact message
router.post("/", createContactMessage);

// Admin routes
router.get("/", authenticate(true), getContactMessages);
router.get("/unread-count", authenticate(true), getUnreadCount);
router.get("/:id", authenticate(true), getContactMessage);
router.patch("/:id/read", authenticate(true), markAsRead);
router.delete("/:id", authenticate(true), deleteContactMessage);

export default router;

