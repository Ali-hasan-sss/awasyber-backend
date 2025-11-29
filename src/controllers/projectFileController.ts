import { Request, Response } from "express";
import {
  createProjectFile,
  getProjectFiles,
  updateProjectFile,
  deleteProjectFile,
} from "@/services/projectFileService";

export const createProjectFileHandler = async (req: Request, res: Response) => {
  try {
    const { getProjectById } = await import("@/services/projectService");

    // Get project to verify ownership and get userId
    let project;
    try {
      project = await getProjectById(req.body.projectId, undefined, undefined);
    } catch (err: any) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Get userId from project
    let userId: string | undefined;
    if (typeof project.userId === "object" && project.userId !== null) {
      userId =
        (project.userId as any)._id?.toString() ||
        (project.userId as any).toString();
    } else if (typeof project.userId === "string") {
      userId = project.userId;
    }

    // If user is authenticated, verify they are the project owner or admin/employee
    // If not authenticated (portal code access), allow using project owner's userId
    if (req.user?.userId) {
      const isOwner = req.user.userId === userId;
      const isAdmin = req.user.role === "admin" || req.user.role === "employee";
      const isAssignedEmployee = project.employees?.some((emp: any) => {
        const empId =
          typeof emp === "object" && emp !== null && "_id" in emp
            ? emp._id.toString()
            : emp.toString();
        return empId === req.user?.userId;
      });

      if (!isOwner && !isAdmin && !isAssignedEmployee) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied: You are not authorized to upload files to this project",
        });
      }
      // Use authenticated user's ID if they are the owner
      if (isOwner) {
        userId = req.user.userId;
      }
    }
    // If no user is authenticated (portal code access), use project owner's userId

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required. Unable to determine project owner.",
      });
    }

    const payload = {
      ...req.body,
      userId: userId,
    };

    const file = await createProjectFile(payload);
    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: file,
    });
  } catch (error: any) {
    console.error("Create project file error:", error);
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
