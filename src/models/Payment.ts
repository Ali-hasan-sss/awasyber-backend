import mongoose, { Schema, Document } from "mongoose";

export type PaymentStatus = "due" | "due_soon" | "paid" | "upcoming";

export interface IPayment extends Document {
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["due", "due_soon", "paid", "upcoming"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ projectId: 1 });
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ dueDate: 1 });
PaymentSchema.index({ status: 1 });

export default mongoose.model<IPayment>("Payment", PaymentSchema);
