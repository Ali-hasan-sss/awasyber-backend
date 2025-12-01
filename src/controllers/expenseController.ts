import { Request, Response } from "express";
import {
  createExpense,
  listExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "@/services/expenseService";

export const createExpenseHandler = async (req: Request, res: Response) => {
  try {
    const expense = await createExpense(req.body);
    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create expense",
    });
  }
};

export const listExpensesHandler = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, type, status, page, limit } = req.query;
    const result = await listExpenses({
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      type: type as any,
      status: status as any,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return res.status(200).json({
      success: true,
      data: result.expenses || [],
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
      message: error.message || "Failed to list expenses",
    });
  }
};

export const getExpenseByIdHandler = async (req: Request, res: Response) => {
  try {
    const expense = await getExpenseById(req.params.id);
    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Expense not found",
    });
  }
};

export const updateExpenseHandler = async (req: Request, res: Response) => {
  try {
    const expense = await updateExpense(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update expense",
    });
  }
};

export const deleteExpenseHandler = async (req: Request, res: Response) => {
  try {
    await deleteExpense(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete expense",
    });
  }
};

