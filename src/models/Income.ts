import mongoose, { Schema, Document } from "mongoose";

export type IncomeType = "one_time" | "monthly_contract";
export type IncomeStatus = "paid" | "pending" | "overdue";

export interface IIncome extends Document {
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  userId: mongoose.Types.ObjectId; // Client associated with this income
  projectId?: mongoose.Types.ObjectId; // Optional - can be null for non-project income
  amount: number;
  type: IncomeType;
  status: IncomeStatus;
  dueDate: Date; // تاريخ الاستحقاق
  paidDate?: Date; // تاريخ الدفع الفعلي
  recurring: boolean; // هل هي دفعة متكررة (عقد شهري)
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema = new Schema<IIncome>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["one_time", "monthly_contract"],
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
  },
  {
    timestamps: true,
  }
);

IncomeSchema.index({ userId: 1 });
IncomeSchema.index({ projectId: 1 });
IncomeSchema.index({ dueDate: 1 });
IncomeSchema.index({ status: 1 });
IncomeSchema.index({ type: 1 });
IncomeSchema.index({ recurring: 1 });

export default mongoose.model<IIncome>("Income", IncomeSchema);
