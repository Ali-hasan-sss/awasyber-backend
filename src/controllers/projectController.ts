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
    const projects = await listProjects({
      userId: userId as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
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
    const project = await getProjectById(req.params.id);
    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Project not found",
    });
  }
};

export const updateProjectHandler = async (req: Request, res: Response) => {
  try {
    const project = await updateProject(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error: any) {
    return res.status(400).json({
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
    const modification = await createModification(req.body);
    return res.status(201).json({
      success: true,
      message: "Modification created successfully",
      data: modification,
    });
  } catch (error: any) {
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
