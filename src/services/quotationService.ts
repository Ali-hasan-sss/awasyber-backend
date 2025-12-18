import { ApiError } from "@/utils/ApiError";
import {
  QuotationRequest,
  IQuotationRequest,
  QuotationStatus,
} from "@/models/QuotationRequest";

export interface CreateQuotationRequestDTO {
  fullName: string;
  phone: string;
  serviceId: string;
  // Optional fields
  email?: string;
  companyName?: string;
  projectDescription?: string;
  budget?: {
    from: number;
    to: number;
  };
  expectedDuration?: string;
  startDate?: string;
  endDate?: string;
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
  // Build the request object with only provided fields
  const requestData: any = {
    fullName: payload.fullName,
    phone: payload.phone,
    serviceId: payload.serviceId,
  };

  // Add optional fields only if provided
  if (payload.email) {
    requestData.email = payload.email;
  }
  if (payload.companyName) {
    requestData.companyName = payload.companyName;
  }
  if (payload.projectDescription) {
    requestData.projectDescription = payload.projectDescription;
  }
  if (payload.budget) {
    requestData.budget = payload.budget;
  }
  if (payload.expectedDuration) {
    requestData.expectedDuration = payload.expectedDuration;
  }
  if (payload.startDate) {
    requestData.startDate = new Date(payload.startDate);
  }
  if (payload.endDate) {
    requestData.endDate = new Date(payload.endDate);
  }
  if (payload.additionalInfo) {
    requestData.additionalInfo = payload.additionalInfo;
  }

  const request = await QuotationRequest.create(requestData);

  // Ensure request is a single document, not an array
  const quotationDoc = Array.isArray(request) ? request[0] : request;

  // Send notification to all admins
  try {
    console.log(
      "Attempting to send notification for new quotation request:",
      quotationDoc._id
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
        quotationId: quotationDoc._id.toString(),
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

    // Send email notification to company email
    try {
      console.log("[QUOTATION] Starting email notification process...", {
        quotationId: quotationDoc._id.toString(),
        fullName: payload.fullName,
      });

      const { sendQuotationRequestEmail } = await import(
        "@/utils/emailService"
      );
      const emailResult = await sendQuotationRequestEmail({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        companyName: payload.companyName,
        serviceName: serviceNameAr, // Use Arabic name for email
        projectDescription: payload.projectDescription,
        budget: payload.budget,
        expectedDuration: payload.expectedDuration,
        startDate: payload.startDate,
        endDate: payload.endDate,
        additionalInfo: payload.additionalInfo,
      });

      if (emailResult.success) {
        console.log("[QUOTATION] ✅ Email notification sent successfully", {
          quotationId: quotationDoc._id.toString(),
          messageId: emailResult.messageId,
          fullName: payload.fullName,
        });
      } else {
        console.error("[QUOTATION] ❌ Email notification failed", {
          quotationId: quotationDoc._id.toString(),
          error: emailResult.error,
          fullName: payload.fullName,
        });
      }
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("[QUOTATION] ❌ Error in email notification process:", {
        quotationId: quotationDoc._id.toString(),
        error:
          emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined,
      });
    }
  } catch (error) {
    // Don't fail the request if notification fails
    console.error("Error sending notification for quotation request:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.stack : error
    );
  }

  return quotationDoc.toObject();
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
