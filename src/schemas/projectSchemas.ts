import { z } from "zod";

export const createPaymentSchema = z.object({
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
    projectId: z.string().min(1, "Project ID is required"),
    userId: z.string().min(1, "User ID is required"),
    amount: z.number().min(0, "Amount must be positive"),
    dueDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Invalid date value",
    }),
    status: z.enum(["due", "due_soon", "paid", "upcoming"]).optional(),
  }),
});

export const updatePaymentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Payment ID is required"),
  }),
  body: z.object({
    title: z
      .object({
        en: z.string().min(1).optional(),
        ar: z.string().min(1).optional(),
      })
      .optional(),
    description: z
      .object({
        en: z.string().optional(),
        ar: z.string().optional(),
      })
      .optional(),
    amount: z.number().min(0).optional(),
    dueDate: z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Invalid date value",
      })
      .optional(),
    status: z.enum(["due", "due_soon", "paid", "upcoming"]).optional(),
  }),
});

export const deletePaymentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Payment ID is required"),
  }),
});

export const generatePortalCodeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

export const getProjectByPortalCodeSchema = z.object({
  params: z.object({
    code: z.string().min(1, "Portal code is required"),
  }),
});

export const createModificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    projectId: z.string().min(1, "Project ID is required"),
    userId: z.string().min(1, "User ID is required"),
    status: z
      .enum(["pending", "accepted", "completed", "needs_extra_payment"])
      .optional(),
    extraPaymentAmount: z.number().min(0).optional(),
    costAccepted: z.boolean().optional(),
  }),
});

export const updateModificationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Modification ID is required"),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    status: z
      .enum([
        "pending",
        "accepted",
        "rejected",
        "completed",
        "needs_extra_payment",
      ])
      .optional(),
    extraPaymentAmount: z.number().min(0).optional(),
    costAccepted: z.boolean().optional(),
  }),
});

export const deleteModificationSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Modification ID is required"),
  }),
});

const phaseSchema = z.object({
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
  duration: z.number().min(0, "Duration must be positive"),
  status: z.enum(["upcoming", "in_progress", "completed"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.object({
      en: z.string().min(1, "English name is required"),
      ar: z.string().min(1, "Arabic name is required"),
    }),
    description: z.object({
      en: z.string().min(1, "English description is required"),
      ar: z.string().min(1, "Arabic description is required"),
    }),
    logo: z.string().url().optional(),
    userId: z.string().min(1, "User ID is required"),
    totalCost: z.number().min(0, "Total cost must be positive"),
    phases: z.array(phaseSchema).min(1, "At least one phase is required"),
    startDate: z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Invalid date value",
      })
      .optional(),
    progress: z.number().min(0).max(100).optional(),
    progressType: z.enum(["project", "modification"]).optional(),
    whatsappGroupLink: z.string().url().optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
  body: z.object({
    name: z
      .object({
        en: z.string().min(1).optional(),
        ar: z.string().min(1).optional(),
      })
      .optional(),
    description: z
      .object({
        en: z.string().min(1).optional(),
        ar: z.string().min(1).optional(),
      })
      .optional(),
    logo: z.string().url().optional(),
    totalCost: z.number().min(0).optional(),
    phases: z.array(phaseSchema).optional(),
    startDate: z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "Invalid date value",
      })
      .optional(),
    progress: z.number().min(0).max(100).optional(),
    progressType: z.enum(["project", "modification"]).optional(),
    activeModificationId: z.string().optional(),
    whatsappGroupLink: z.string().url().optional(),
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Project ID is required"),
  }),
});
