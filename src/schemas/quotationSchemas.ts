import { z } from "zod";

const budgetSchema = z.object({
  from: z.number().nonnegative(),
  to: z.number().nonnegative(),
});

const dateString = z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
  message: "Invalid date value",
});

export const createQuotationRequestSchema = z.object({
  body: z
    .object({
      fullName: z.string().min(3),
      phone: z.string().min(6),
      serviceId: z.string().min(1),
      // Optional fields - accept empty strings or valid values
      email: z
        .union([z.string().email(), z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      companyName: z
        .union([z.string().min(2), z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      projectDescription: z
        .union([z.string().min(10), z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      budget: budgetSchema
        .refine((data) => data.to >= data.from, {
          message: "Budget 'to' must be greater than or equal to 'from'",
        })
        .optional(),
      expectedDuration: z
        .union([z.string().min(2), z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      startDate: z
        .union([dateString, z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      endDate: z
        .union([dateString, z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
      additionalInfo: z
        .union([z.string(), z.literal("")])
        .optional()
        .transform((val) => (val === "" || !val ? undefined : val)),
    })
    .refine(
      (data) => {
        // Only validate date order if both dates are provided
        if (data.startDate && data.endDate) {
          return (
            new Date(data.endDate).getTime() >=
            new Date(data.startDate).getTime()
          );
        }
        return true;
      },
      { message: "End date must be after start date", path: ["endDate"] }
    ),
});

export const listQuotationRequestSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((value) => Number(value))
      .optional(),
    limit: z
      .string()
      .transform((value) => Number(value))
      .optional(),
    search: z.string().optional(),
    serviceId: z.string().optional(),
    status: z.enum(["pending", "in_review", "quoted", "closed"]).optional(),
  }),
});

export const quotationIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateQuotationStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(["pending", "in_review", "quoted", "closed"]),
  }),
});
