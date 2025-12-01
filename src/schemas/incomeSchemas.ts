import { z } from "zod";

export const createIncomeSchema = z.object({
  body: z.object({
    title: z.object({
      en: z.string().min(1, "English title is required"),
      ar: z.string().min(1, "Arabic title is required"),
    }),
    description: z
      .object({
        en: z.string().optional(),
        ar: z.string().optional(),
      })
      .optional(),
    userId: z.string().min(1, "User ID is required"),
    projectId: z.string().optional(),
    amount: z.number().min(0, "Amount must be positive"),
    type: z.enum(["one_time", "monthly_contract"]),
    status: z.enum(["paid", "pending", "overdue"]).optional(),
    dueDate: z.string().refine(
      (date) => {
        return !isNaN(Date.parse(date));
      },
      { message: "Invalid date format" }
    ),
    paidDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true;
          return !isNaN(Date.parse(date));
        },
        { message: "Invalid date format" }
      )
      .optional(),
    recurring: z.boolean().optional(),
  }),
});

export const updateIncomeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Income ID is required"),
  }),
  body: createIncomeSchema.shape.body.partial(),
});

export const getIncomeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Income ID is required"),
  }),
});

export const deleteIncomeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Income ID is required"),
  }),
});

export const listIncomesSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    type: z.enum(["one_time", "monthly_contract"]).optional(),
    status: z.enum(["paid", "pending", "overdue"]).optional(),
    userId: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
