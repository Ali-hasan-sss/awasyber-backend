import Income, { IIncome, IncomeType, IncomeStatus } from "@/models/Income";
import { Types } from "mongoose";

export interface CreateIncomePayload {
  title: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  userId: string;
  projectId?: string;
  amount: number;
  type: IncomeType;
  status?: IncomeStatus;
  dueDate: string;
  paidDate?: string;
  recurring?: boolean;
}

export interface UpdateIncomePayload {
  title?: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  userId?: string;
  projectId?: string;
  amount?: number;
  type?: IncomeType;
  status?: IncomeStatus;
  dueDate?: string;
  paidDate?: string;
  recurring?: boolean;
}

export const createIncome = async (payload: CreateIncomePayload) => {
  const income = new Income({
    ...payload,
    userId: new Types.ObjectId(payload.userId),
    projectId: payload.projectId
      ? new Types.ObjectId(payload.projectId)
      : undefined,
    dueDate: new Date(payload.dueDate),
    paidDate: payload.paidDate ? new Date(payload.paidDate) : undefined,
    recurring:
      payload.type === "monthly_contract" ? true : payload.recurring || false,
  });
  return await income.save();
};

export const listIncomes = async (
  filters: {
    startDate?: string;
    endDate?: string;
    type?: IncomeType;
    status?: IncomeStatus;
    userId?: string;
    page?: number;
    limit?: number;
  } = {}
) => {
  const {
    startDate,
    endDate,
    type,
    status,
    userId,
    page = 1,
    limit = 100,
  } = filters;
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

  if (userId) {
    query.userId = new Types.ObjectId(userId);
  }

  const incomes = await Income.find(query)
    .populate("userId", "name companyName")
    .populate("projectId", "name logo")
    .sort({ dueDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Income.countDocuments(query);

  return {
    incomes,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const getIncomeById = async (id: string) => {
  const income = await Income.findById(id)
    .populate("userId", "name companyName")
    .populate("projectId", "name logo")
    .lean();
  if (!income) {
    throw new Error("Income not found");
  }
  return income;
};

export const updateIncome = async (
  id: string,
  payload: UpdateIncomePayload
) => {
  const updateData: any = { ...payload };
  if (payload.dueDate) {
    updateData.dueDate = new Date(payload.dueDate);
  }
  if (payload.paidDate !== undefined) {
    updateData.paidDate = payload.paidDate ? new Date(payload.paidDate) : null;
  }
  if (payload.userId) {
    updateData.userId = new Types.ObjectId(payload.userId);
  }
  if (payload.projectId !== undefined) {
    updateData.projectId = payload.projectId
      ? new Types.ObjectId(payload.projectId)
      : null;
  }

  const income = await Income.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("userId", "name companyName")
    .populate("projectId", "name logo")
    .lean();

  if (!income) {
    throw new Error("Income not found");
  }

  return income;
};

export const deleteIncome = async (id: string) => {
  const income = await Income.findById(id);
  if (!income) {
    throw new Error("Income not found");
  }
  await Income.findByIdAndDelete(id);
  return income;
};
