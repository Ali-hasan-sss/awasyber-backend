import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  role: "admin" | "employee" | "client";
  fcmToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationLog extends Document {
  userId: mongoose.Types.ObjectId;
  role: "admin" | "employee" | "client";
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "client"],
      required: true,
    },
    fcmToken: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "client"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, role: 1 });
NotificationLogSchema.index({ userId: 1, read: 1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export const NotificationLog = mongoose.model<INotificationLog>(
  "NotificationLog",
  NotificationLogSchema
);

