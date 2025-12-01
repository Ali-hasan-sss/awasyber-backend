import mongoose, { Schema, Document } from "mongoose";

export type ExpenseType =
  | "subscription_monthly"
  | "subscription_yearly"
  | "utility"
  | "one_time";
export type ExpenseStatus = "paid" | "pending" | "overdue";

export interface IExpense extends Document {
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  amount: number;
  type: ExpenseType;
  status: ExpenseStatus;
  dueDate: Date; // تاريخ الاستحقاق
  paidDate?: Date; // تاريخ الدفع الفعلي
  recurring: boolean; // هل هي مصروف متكرر
  recurringInterval?: "monthly" | "yearly"; // نوع التكرار (للاشتراكات)
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: [
        "subscription_monthly",
        "subscription_yearly",
        "utility",
        "one_time",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    recurring: { type: Boolean, default: false },
    recurringInterval: {
      type: String,
      enum: ["monthly", "yearly"],
    },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.index({ dueDate: 1 });
ExpenseSchema.index({ status: 1 });
ExpenseSchema.index({ type: 1 });
ExpenseSchema.index({ recurring: 1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
