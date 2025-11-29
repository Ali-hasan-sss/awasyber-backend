import { Request, Response } from "express";
import {
  createProjectFile,
  getProjectFiles,
  updateProjectFile,
  deleteProjectFile,
} from "@/services/projectFileService";

export const createProjectFileHandler = async (req: Request, res: Response) => {
  try {
    const file = await createProjectFile(req.body);
    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: file,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};

export const getProjectFilesHandler = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { uploadedBy } = req.query;
    const files = await getProjectFiles(
      projectId,
      uploadedBy as "client" | "company" | undefined
    );
    return res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get files",
    });
  }
};

export const updateProjectFileHandler = async (req: Request, res: Response) => {
  try {
    const file = await updateProjectFile(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: file,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update file",
    });
  }
};

export const deleteProjectFileHandler = async (req: Request, res: Response) => {
  try {
    await deleteProjectFile(req.params.id);
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete file",
    });
  }
};
