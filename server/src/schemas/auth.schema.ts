import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must be at most 72 bytes");

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: passwordSchema
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72)
});
