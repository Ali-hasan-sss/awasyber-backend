import { z } from "zod";

const localizedFieldSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

const featureSchema = z.object({
  icon: z.string().min(1),
  name: localizedFieldSchema,
  description: localizedFieldSchema.optional(),
});

export const createServiceSchema = z.object({
  body: z.object({
    title: localizedFieldSchema,
    description: localizedFieldSchema.optional(),
    images: z
      .array(z.string().url())
      .min(1, "At least one image URL is required"),
    features: z.array(featureSchema).optional(),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      title: localizedFieldSchema.optional(),
      description: localizedFieldSchema.optional(),
      images: z
        .array(z.string().url())
        .min(1, "At least one image URL is required")
        .optional(),
      features: z.array(featureSchema).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const serviceIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
