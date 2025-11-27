import { ApiError } from "@/utils/ApiError";
import {
  QuotationRequest,
  IQuotationRequest,
  QuotationStatus,
} from "@/models/QuotationRequest";

export interface CreateQuotationRequestDTO {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceId: string;
  projectDescription: string;
  budget: {
    from: number;
    to: number;
  };
  expectedDuration: string;
  startDate: string;
  endDate: string;
  additionalInfo?: string;
}

export interface ListQuotationRequestOptions {
  page?: number;
  limit?: number;
  search?: string;
  serviceId?: string;
  status?: QuotationStatus;
}

export const createQuotationRequest = async (
  payload: CreateQuotationRequestDTO
) => {
  const request = await QuotationRequest.create({
    ...payload,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
  });
  return request.toObject();
};

export const listQuotationRequests = async (
  options: ListQuotationRequestOptions = {}
) => {
  const page = Number(options.page) > 0 ? Number(options.page) : 1;
  const limit = Number(options.limit) > 0 ? Number(options.limit) : 10;
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};

  if (options.search) {
    query.$or = [
      { fullName: { $regex: options.search, $options: "i" } },
      { email: { $regex: options.search, $options: "i" } },
      { phone: { $regex: options.search, $options: "i" } },
    ];
  }

  if (options.serviceId) {
    query.serviceId = options.serviceId;
  }

  if (options.status) {
    query.status = options.status;
  }

  const total = await QuotationRequest.countDocuments(query);
  const requests = await QuotationRequest.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    requests,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getQuotationRequestById = async (id: string) => {
  const request = await QuotationRequest.findById(id).lean();
  if (!request) {
    throw new ApiError(404, "Quotation request not found");
  }
  return request;
};

export const updateQuotationStatus = async (
  id: string,
  status: QuotationStatus
) => {
  const request = await QuotationRequest.findById(id);
  if (!request) {
    throw new ApiError(404, "Quotation request not found");
  }
  request.status = status;
  await request.save();
  return request.toObject();
};
