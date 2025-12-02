import { z } from "zod";

const featureSchema = z.object({
  name: z.object({
    en: z.string().min(1, "English name is required"),
    ar: z.string().min(1, "Arabic name is required"),
  }),
  description: z.object({
    en: z.string().min(1, "English description is required"),
    ar: z.string().min(1, "Arabic description is required"),
  }),
  icon: z.string().min(1, "Icon is required"),
  order: z.number().int().min(0).default(0),
});

export const createSectionSchema = z.object({
  body: z.object({
    title: z.object({
      en: z.string().min(1, "English title is required"),
      ar: z.string().min(1, "Arabic title is required"),
    }),
    description: z.object({
      en: z.string().min(1, "English description is required"),
      ar: z.string().min(1, "Arabic description is required"),
    }),
    page: z.enum(["home", "about", "services", "contact", "portfolio"]),
    images: z.array(z.string()).optional().default([]),
    features: z.array(featureSchema).optional().default([]),
    order: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateSectionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Section ID is required"),
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
        en: z.string().min(1).optional(),
        ar: z.string().min(1).optional(),
      })
      .optional(),
    page: z
      .enum(["home", "about", "services", "contact", "portfolio"])
      .optional(),
    images: z.array(z.string()).optional(),
    features: z.array(featureSchema).optional(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getSectionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Section ID is required"),
  }),
});

export const deleteSectionSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Section ID is required"),
  }),
});

export const getSectionsByPageSchema = z.object({
  query: z.object({
    page: z.enum(["home", "about", "services", "contact", "portfolio"]),
    locale: z.enum(["en", "ar"]).optional(),
  }),
});
