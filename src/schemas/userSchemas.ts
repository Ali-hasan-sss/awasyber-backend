import { z } from "zod";

const roleEnum = z.enum(["admin", "client"]).optional();

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(6),
    companyName: z.string().min(2),
    role: roleEnum,
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(6).optional(),
      companyName: z.string().min(2).optional(),
      role: z.enum(["admin", "client"]).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required",
    }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});
