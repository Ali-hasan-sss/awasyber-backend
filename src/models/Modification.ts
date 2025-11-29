import mongoose, { Schema, Document } from "mongoose";

export type ModificationPriority = "low" | "medium" | "high" | "critical";
export type ModificationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "needs_extra_payment";

export interface IModificationFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
}

export interface IModification extends Document {
  title: string;
  description: string;
  priority: ModificationPriority;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: ModificationStatus;
  extraPaymentAmount?: number;
  costAccepted: boolean;
  attachedFiles?: IModificationFile[]; // الملفات المرفقة (حتى 5 ملفات)
  createdAt: Date;
  updatedAt: Date;
}

const ModificationSchema = new Schema<IModification>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
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
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "needs_extra_payment"],
      default: "pending",
    },
    extraPaymentAmount: { type: Number, min: 0 },
    costAccepted: { type: Boolean, default: false },
    attachedFiles: [
      {
        url: { type: String, required: true },
        fileName: { type: String, required: true },
        fileType: { type: String, required: true },
        fileSize: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ModificationSchema.index({ projectId: 1 });
ModificationSchema.index({ userId: 1 });
ModificationSchema.index({ status: 1 });
ModificationSchema.index({ priority: 1 });

export default mongoose.model<IModification>(
  "Modification",
  ModificationSchema
);
