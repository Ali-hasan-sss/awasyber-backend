import { Request, Response } from "express";
import {
  createIncome,
  listIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "@/services/incomeService";

export const createIncomeHandler = async (req: Request, res: Response) => {
  try {
    const income = await createIncome(req.body);
    return res.status(201).json({
      success: true,
      message: "Income created successfully",
      data: income,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create income",
    });
  }
};

export const listIncomesHandler = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, status, userId, page, limit } = req.query;
    const result = await listIncomes({
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      type: type as any,
      status: status as any,
      userId: userId as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return res.status(200).json({
      success: true,
      data: result.incomes || [],
      pagination: {
        totalCount: result.totalCount || 0,
        page: result.page || 1,
        limit: result.limit || 100,
        totalPages: result.totalPages || 0,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to list incomes",
    });
  }
};

export const getIncomeByIdHandler = async (req: Request, res: Response) => {
  try {
    const income = await getIncomeById(req.params.id);
    return res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Income not found",
    });
  }
};

export const updateIncomeHandler = async (req: Request, res: Response) => {
  try {
    const income = await updateIncome(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      data: income,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update income",
    });
  }
};

export const deleteIncomeHandler = async (req: Request, res: Response) => {
  try {
    await deleteIncome(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete income",
    });
  }
};
