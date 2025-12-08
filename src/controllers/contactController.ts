import { Request, Response } from "express";
import { ContactMessage } from "@/models/ContactMessage";
import { NotificationLog } from "@/models/Notification";
import { User } from "@/models/User";

// Create a new contact message
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      message,
    });

    await contactMessage.save();

    // Create notification for all admins
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map((admin) => {
      return NotificationLog.create({
        userId: admin._id,
        role: "admin",
        title: "New Contact Message",
        body: `New message from ${name} (${email})`,
        data: {
          type: "contact_message",
          contactMessageId: contactMessage._id.toString(),
        },
        read: false,
      });
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contactMessage,
    });
  } catch (error: any) {
    console.error("Error creating contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get all contact messages (admin only)
export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const { read, page = 1, limit = 20 } = req.query;

    const query: any = {};
    if (read !== undefined) {
      query.read = read === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ContactMessage.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// Get a single contact message
export const getContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error("Error fetching contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
      error: error.message,
    });
  }
};

// Mark message as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error: any) {
    console.error("Error marking message as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error.message,
    });
  }
};

// Delete a contact message
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

// Get unread count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await ContactMessage.countDocuments({ read: false });

    res.json({
      success: true,
      count,
    });
  } catch (error: any) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
      error: error.message,
    });
  }
};

