import { z } from "zod";

const featureSchema = z.object({
  icon: z.string().min(1),
  name: z.object({
    en: z.string().min(1),
    ar: z.string().min(1),
  }),
  description: z
    .object({
      en: z.string().optional(),
      ar: z.string().optional(),
    })
    .optional(),
});

export const createPortfolioSchema = z.object({
  body: z.object({
    title: z.object({
      en: z.string().min(1),
      ar: z.string().min(1),
    }),
    description: z
      .object({
        en: z.string().optional(),
        ar: z.string().optional(),
      })
      .optional(),
    serviceId: z.string().min(1),
    features: z.array(featureSchema).optional(),
    images: z.array(z.string().url()).min(1),
    completionDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Invalid date value",
    }),
    url: z.string().url().optional(),
    youtubeUrl: z.string().url().optional().or(z.literal("")),
  }),
});

export const updatePortfolioSchema = z.object({
  body: z
    .object({
      title: z
        .object({
          en: z.string().min(1),
          ar: z.string().min(1),
        })
        .optional(),
      description: z
        .object({
          en: z.string().optional(),
          ar: z.string().optional(),
        })
        .optional(),
      serviceId: z.string().min(1).optional(),
      features: z.array(featureSchema).optional(),
      images: z.array(z.string().url()).min(1).optional(),
      completionDate: z
        .string()
        .refine((val) => !Number.isNaN(Date.parse(val)), {
          message: "Invalid date value",
        })
        .optional(),
      url: z.string().url().optional(),
      youtubeUrl: z.string().url().optional().or(z.literal("")),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const portfolioIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listPortfoliosSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((value) => Number(value))
      .optional(),
    limit: z
      .string()
      .transform((value) => Number(value))
      .optional(),
    serviceId: z.string().optional(),
  }),
});
