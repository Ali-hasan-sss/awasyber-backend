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
      email: z.string().email(),
      phone: z.string().min(6),
      companyName: z.string().min(2).optional(),
      serviceId: z.string().min(1),
      projectDescription: z.string().min(10),
      budget: budgetSchema.refine((data) => data.to >= data.from, {
        message: "Budget 'to' must be greater than or equal to 'from'",
      }),
      expectedDuration: z.string().min(2),
      startDate: dateString,
      endDate: dateString,
      additionalInfo: z.string().optional(),
    })
    .refine(
      (data) =>
        new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
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
