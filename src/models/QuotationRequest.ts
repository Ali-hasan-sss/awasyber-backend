import { Schema, model, Document } from "mongoose";

export type QuotationStatus = "pending" | "in_review" | "quoted" | "closed";

export interface IBudgetRange {
  from: number;
  to: number;
}

export interface IQuotationRequest extends Document {
  fullName: string;
  email?: string;
  phone: string;
  companyName?: string;
  serviceId: string;
  projectDescription?: string;
  budget?: IBudgetRange;
  expectedDuration?: string;
  startDate?: Date;
  endDate?: Date;
  additionalInfo?: string;
  status: QuotationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudgetRange>(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  { _id: false }
);

const QuotationRequestSchema = new Schema<IQuotationRequest>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    serviceId: { type: String, required: true, trim: true },
    projectDescription: { type: String },
    budget: { type: BudgetSchema },
    expectedDuration: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    additionalInfo: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_review", "quoted", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

QuotationRequestSchema.index({ email: 1, createdAt: -1 });
QuotationRequestSchema.index({ serviceId: 1 });

export const QuotationRequest = model<IQuotationRequest>(
  "QuotationRequest",
  QuotationRequestSchema
);
