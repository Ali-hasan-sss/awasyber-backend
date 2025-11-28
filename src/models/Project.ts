import mongoose, { Schema, Document } from "mongoose";

export type PhaseStatus = "upcoming" | "in_progress" | "completed";

export interface IProjectPhase {
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  duration: number; // المدة بالأيام
  status: PhaseStatus;
  progress: number; // 0-100 (للمرحلة الحالية فقط)
}

export interface IProject extends Document {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  logo?: string; // صورة لوغو المشروع
  userId: mongoose.Types.ObjectId;
  totalCost: number;
  payments: mongoose.Types.ObjectId[];
  modifications: mongoose.Types.ObjectId[];
  phases: IProjectPhase[]; // مصفوفة المراحل
  startDate?: Date; // تاريخ بدء المشروع
  progress: number; // 0-100
  progressType: "project" | "modification"; // نوع التقدم: للمشروع أو للتعديل المقبول
  activeModificationId?: mongoose.Types.ObjectId; // التعديل المقبول الذي يتم العمل عليه حالياً
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalCost: { type: Number, required: true, min: 0 },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    modifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Modification",
      },
    ],
    phases: [
      {
        title: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        description: {
          en: { type: String },
          ar: { type: String },
        },
        duration: { type: Number, required: true, min: 0 }, // المدة بالأيام
        status: {
          type: String,
          enum: ["upcoming", "in_progress", "completed"],
          default: "upcoming",
        },
        progress: { type: Number, default: 0, min: 0, max: 100 },
      },
    ],
    logo: { type: String },
    startDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    progressType: {
      type: String,
      enum: ["project", "modification"],
      default: "project",
    },
    activeModificationId: {
      type: Schema.Types.ObjectId,
      ref: "Modification",
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ userId: 1 });
ProjectSchema.index({ createdAt: -1 });

export default mongoose.model<IProject>("Project", ProjectSchema);
