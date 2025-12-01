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

  // Send notification to all admins
  try {
    console.log(
      "Attempting to send notification for new quotation request:",
      request._id
    );
    const { sendNotificationToAllAdmins } = await import(
      "@/utils/firebaseAdmin"
    );
    const { Service } = await import("@/models/Service");

    // Get service name for notification
    const service = await Service.findById(payload.serviceId).lean();
    const serviceNameEn = service?.title?.en || "Service";
    const serviceNameAr = service?.title?.ar || "خدمة";

    // Send bilingual notification
    const titleEn = "New Quotation Request";
    const titleAr = "طلب عرض سعر جديد";
    const bodyEn = `${payload.fullName}${
      payload.companyName ? ` (${payload.companyName})` : ""
    } requested a quote for ${serviceNameEn}`;
    const bodyAr = `${payload.fullName}${
      payload.companyName ? ` (${payload.companyName})` : ""
    } طلب عرض سعر لـ ${serviceNameAr}`;

    // Send notification with both languages
    const result = await sendNotificationToAllAdmins(
      `${titleEn} | ${titleAr}`,
      `${bodyEn}\n${bodyAr}`,
      {
        type: "quotation_request",
        quotationId: request._id.toString(),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        companyName: payload.companyName || "",
        serviceId: payload.serviceId,
        serviceNameEn: serviceNameEn,
        serviceNameAr: serviceNameAr,
      }
    );
    console.log("Notification result:", result);
  } catch (error) {
    // Don't fail the request if notification fails
    console.error("Error sending notification for quotation request:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.stack : error
    );
  }

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
