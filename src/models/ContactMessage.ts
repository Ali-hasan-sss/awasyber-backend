import { Schema, model, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ContactMessageSchema.index({ email: 1, createdAt: -1 });
ContactMessageSchema.index({ read: 1, createdAt: -1 });

export const ContactMessage = model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);

