import { Request, Response } from "express";
import {
  createSection,
  listSections,
  getSectionById,
  updateSection,
  deleteSection,
  getSectionsByPage,
} from "@/services/sectionService";

export const createSectionHandler = async (req: Request, res: Response) => {
  try {
    const section = await createSection(req.body);
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create section",
    });
  }
};

export const listSectionsHandler = async (req: Request, res: Response) => {
  try {
    const { page, isActive } = req.query;
    const sections = await listSections({
      page: page as any,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
    });
    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to list sections",
    });
  }
};

export const getSectionByIdHandler = async (req: Request, res: Response) => {
  try {
    const section = await getSectionById(req.params.id);
    return res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Section not found",
    });
  }
};

export const updateSectionHandler = async (req: Request, res: Response) => {
  try {
    const section = await updateSection(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update section",
    });
  }
};

export const deleteSectionHandler = async (req: Request, res: Response) => {
  try {
    await deleteSection(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete section",
    });
  }
};

export const getSectionsByPageHandler = async (req: Request, res: Response) => {
  try {
    const { page, locale } = req.query;
    // Ensure locale is valid, default to "en" if not provided or invalid
    const validLocale = locale === "ar" ? "ar" : "en";
    const sections = await getSectionsByPage(page as any, validLocale);
    return res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get sections",
    });
  }
};
