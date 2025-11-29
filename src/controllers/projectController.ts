import { Request, Response } from "express";
import {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
  createPayment,
  updatePayment,
  deletePayment,
  createModification,
  updateModification,
  deleteModification,
  generatePortalCode,
  getProjectByPortalCode,
} from "@/services/projectService";

// Project handlers
export const createProjectHandler = async (req: Request, res: Response) => {
  try {
    const project = await createProject(req.body);
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create project",
    });
  }
};

export const listProjectsHandler = async (req: Request, res: Response) => {
  try {
    const { userId, page, limit } = req.query;
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role as
      | "admin"
      | "employee"
      | "client"
      | undefined;
    const projects = await listProjects({
      userId: userId as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      currentUserId,
      currentUserRole,
    });
    return res.status(200).json({
      success: true,
      data: Array.isArray(projects) ? projects : [],
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to list projects",
    });
  }
};

export const getProjectByIdHandler = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role as
      | "admin"
      | "employee"
      | "client"
      | undefined;
    const project = await getProjectById(
      req.params.id,
      currentUserId,
      currentUserRole
    );
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return res
      .status(error.message?.includes("Access denied") ? 403 : 404)
      .json({
        success: false,
        message: error.message || "Project not found",
      });
  }
};

export const updateProjectHandler = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role as
      | "admin"
      | "employee"
      | "client"
      | undefined;
    const project = await updateProject(
      req.params.id,
      req.body,
      currentUserId,
      currentUserRole
    );
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error: any) {
    return res
      .status(error.message?.includes("Access denied") ? 403 : 400)
      .json({
        success: false,
        message: error.message || "Failed to update project",
      });
  }
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  try {
    await deleteProject(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete project",
    });
  }
};

// Payment handlers
export const createPaymentHandler = async (req: Request, res: Response) => {
  try {
    const payment = await createPayment(req.body);
    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create payment",
    });
  }
};

export const updatePaymentHandler = async (req: Request, res: Response) => {
  try {
    const payment = await updatePayment(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update payment",
    });
  }
};

export const deletePaymentHandler = async (req: Request, res: Response) => {
  try {
    await deletePayment(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete payment",
    });
  }
};

// Modification handlers
export const createModificationHandler = async (
  req: Request,
  res: Response
) => {
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
            "Access denied: You are not authorized to modify this project",
        });
      }
      // Use authenticated user's ID if they are the owner
      if (isOwner) {
        userId = req.user.userId;
      }
    }
    // If no user is authenticated (portal code access), use project owner's userId
    // This allows clients to create modifications using portal code without token

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

    const modification = await createModification(payload);
    return res.status(201).json({
      success: true,
      message: "Modification created successfully",
      data: modification,
    });
  } catch (error: any) {
    console.error("Create modification error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create modification",
    });
  }
};

export const updateModificationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const modification = await updateModification(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Modification updated successfully",
      data: modification,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update modification",
    });
  }
};

export const deleteModificationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteModification(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Modification deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete modification",
    });
  }
};

// Generate portal code for project
export const generatePortalCodeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await generatePortalCode(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Portal code generated successfully",
      data: { portalCode: project.portalCode },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to generate portal code",
    });
  }
};

// Get project by portal code (public endpoint for client portal)
export const getProjectByPortalCodeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await getProjectByPortalCode(req.params.code);
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid portal code",
    });
  }
};
