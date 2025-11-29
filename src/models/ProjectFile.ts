import mongoose, { Schema, Document } from "mongoose";

export type FileUploadedBy = "client" | "company";

export interface IProjectFile extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadedBy: FileUploadedBy;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectFileSchema = new Schema<IProjectFile>(
  {
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
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    uploadedBy: {
      type: String,
      enum: ["client", "company"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProjectFileSchema.index({ projectId: 1 });
ProjectFileSchema.index({ userId: 1 });
ProjectFileSchema.index({ uploadedBy: 1 });

export default mongoose.model<IProjectFile>("ProjectFile", ProjectFileSchema);

