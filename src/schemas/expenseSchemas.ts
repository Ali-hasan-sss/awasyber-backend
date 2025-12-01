import { z } from "zod";

export const createExpenseSchema = z.object({
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
    amount: z.number().min(0, "Amount must be positive"),
    type: z.enum([
      "subscription_monthly",
      "subscription_yearly",
      "utility",
      "one_time",
    ]),
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
    recurringInterval: z.enum(["monthly", "yearly"]).optional(),
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Expense ID is required"),
  }),
  body: createExpenseSchema.shape.body.partial(),
});

export const getExpenseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Expense ID is required"),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Expense ID is required"),
  }),
});

export const listExpensesSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    type: z
      .enum([
        "subscription_monthly",
        "subscription_yearly",
        "utility",
        "one_time",
      ])
      .optional(),
    status: z.enum(["paid", "pending", "overdue"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
