import { z } from "zod";

const localizedFieldSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const createArticleSchema = z.object({
  body: z.object({
    title: localizedFieldSchema,
    description: localizedFieldSchema,
    body: localizedFieldSchema,
    serviceId: z.string().min(1, "Service ID is required"),
    mainImage: z.string().url("Main image must be a valid URL"),
    publishedAt: z.string().datetime().optional(),
  }),
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      title: localizedFieldSchema.optional(),
      description: localizedFieldSchema.optional(),
      body: localizedFieldSchema.optional(),
      serviceId: z.string().min(1).optional(),
      mainImage: z.string().url().optional(),
      publishedAt: z.string().datetime().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const articleIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listArticlesQuerySchema = z.object({
  query: z.object({
    serviceId: z.string().optional(),
    lang: z.enum(["en", "ar"]).optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});
