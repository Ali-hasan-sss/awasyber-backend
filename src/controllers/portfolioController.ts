import { Request, Response } from "express";
import {
  createPortfolio,
  listPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "@/services/portfolioService";

export const createPortfolioHandler = async (req: Request, res: Response) => {
  try {
    const portfolio = await createPortfolio(req.body);
    return res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      data: portfolio,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create portfolio",
    });
  }
};

export const listPortfoliosHandler = async (req: Request, res: Response) => {
  try {
    const lang = req.headers["x-lang"] as string | undefined;
    const { serviceId, page, limit } = req.query;
    const portfolios = await listPortfolios(lang, {
      serviceId: serviceId as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return res.status(200).json({
      success: true,
      data: Array.isArray(portfolios) ? portfolios : [],
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to list portfolios",
    });
  }
};

export const getPortfolioByIdHandler = async (req: Request, res: Response) => {
  try {
    const lang = req.headers["x-lang"] as string | undefined;
    const portfolio = await getPortfolioById(req.params.id, lang);
    return res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Portfolio not found",
    });
  }
};

export const updatePortfolioHandler = async (req: Request, res: Response) => {
  try {
    const portfolio = await updatePortfolio(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      data: portfolio,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update portfolio",
    });
  }
};

export const deletePortfolioHandler = async (req: Request, res: Response) => {
  try {
    await deletePortfolio(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete portfolio",
    });
  }
};
