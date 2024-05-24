import { ZodType, z } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email().max(100),
    password: z.string().min(6).max(20),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email().max(100),
    password: z.string().min(6).max(20),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(3).max(100).optional(),
    password: z.string().min(6).max(20).optional(),
  });
}
