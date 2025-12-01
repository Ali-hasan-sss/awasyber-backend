import Expense, {
  IExpense,
  ExpenseType,
  ExpenseStatus,
} from "@/models/Expense";
import { Types } from "mongoose";

export interface CreateExpensePayload {
  title: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  amount: number;
  type: ExpenseType;
  status?: ExpenseStatus;
  dueDate: string;
  paidDate?: string;
  recurring?: boolean;
  recurringInterval?: "monthly" | "yearly";
}

export interface UpdateExpensePayload {
  title?: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  amount?: number;
  type?: ExpenseType;
  status?: ExpenseStatus;
  dueDate?: string;
  paidDate?: string;
  recurring?: boolean;
  recurringInterval?: "monthly" | "yearly";
}

export const createExpense = async (payload: CreateExpensePayload) => {
  const expense = new Expense({
    ...payload,
    dueDate: new Date(payload.dueDate),
    paidDate: payload.paidDate ? new Date(payload.paidDate) : undefined,
  });
  return await expense.save();
};

export const listExpenses = async (
  filters: {
    startDate?: string;
    endDate?: string;
    type?: ExpenseType;
    status?: ExpenseStatus;
    page?: number;
    limit?: number;
  } = {}
) => {
  const { startDate, endDate, type, status, page = 1, limit = 100 } = filters;
  const skip = (page - 1) * limit;

  const query: any = {};

  if (startDate || endDate) {
    query.dueDate = {};
    if (startDate) {
      query.dueDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.dueDate.$lte = new Date(endDate);
    }
  }

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  const expenses = await Expense.find(query)
    .sort({ dueDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Expense.countDocuments(query);

  return {
    expenses,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const getExpenseById = async (id: string) => {
  const expense = await Expense.findById(id).lean();
  if (!expense) {
    throw new Error("Expense not found");
  }
  return expense;
};

export const updateExpense = async (
  id: string,
  payload: UpdateExpensePayload
) => {
  const updateData: any = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  if (payload.paidDate !== undefined) {
    updateData.paidDate = payload.paidDate ? new Date(payload.paidDate) : null;
  }

  const expense = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  if (!expense) {
    throw new Error("Expense not found");
  }

  return expense;
};

export const deleteExpense = async (id: string) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new Error("Expense not found");
  }
  await Expense.findByIdAndDelete(id);
  return expense;
};
