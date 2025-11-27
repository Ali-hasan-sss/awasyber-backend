import { z } from "zod";

const emailField = z.string().email({ message: "Invalid email address" });

export const registerAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: emailField,
    phone: z.string().min(6),
    companyName: z.string().min(2),
    password: z.string().min(6),
    setupKey: z.string().min(4),
  }),
});

export const loginAdminSchema = z.object({
  body: z.object({
    email: emailField,
    password: z.string().min(6),
  }),
});

export const loginWithCodeSchema = z.object({
  body: z.object({
    email: emailField,
    code: z.string().min(4),
  }),
});

export const loginWithCodeOnlySchema = z.object({
  body: z.object({
    code: z.string().min(4, "Login code is required"),
  }),
});
