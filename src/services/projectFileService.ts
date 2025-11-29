import ProjectFile, {
  IProjectFile,
  FileUploadedBy,
} from "@/models/ProjectFile";
import mongoose from "mongoose";

export const createProjectFile = async (data: {
  projectId: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadedBy: FileUploadedBy;
}) => {
  const file = new ProjectFile({
    projectId: new mongoose.Types.ObjectId(data.projectId),
    userId: new mongoose.Types.ObjectId(data.userId),
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    fileType: data.fileType,
    fileSize: data.fileSize,
    uploadedBy: data.uploadedBy,
  });

  return await file.save();
};

export const getProjectFiles = async (
  projectId: string,
  uploadedBy?: FileUploadedBy
) => {
  const query: any = {
    projectId: new mongoose.Types.ObjectId(projectId),
  };

  if (uploadedBy) {
    query.uploadedBy = uploadedBy;
  }

  return await ProjectFile.find(query)
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
};

export const updateProjectFile = async (
  id: string,
  data: { fileName?: string }
) => {
  const file = await ProjectFile.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  ).populate("userId", "name email");

  if (!file) {
    throw new Error("File not found");
  }

  return file;
};

export const deleteProjectFile = async (id: string) => {
  const file = await ProjectFile.findByIdAndDelete(id);
  if (!file) {
    throw new Error("File not found");
  }
  return file;
};
