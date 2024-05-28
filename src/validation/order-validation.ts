import { ZodType, z } from "zod";
import { Types } from "mongoose";

export class OrderValidation {
  static readonly GET: ZodType = z.object({
    orderId: z
      .string()
      .transform((value) => new Types.ObjectId(value))
      .refine((value) => Types.ObjectId.isValid(value), {
        message: "Invalid ObjectId format",
      }),
  });

  static readonly CREATE: ZodType = z
    .array(
      z.object({
        productId: z
          .string()
          .transform((value) => new Types.ObjectId(value))
          .refine((value) => Types.ObjectId.isValid(value), {
            message: "Invalid ObjectId format",
          }),
        quantity: z.number().positive(),
      })
    )
    .min(1);
}
