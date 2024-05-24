import { ZodType, z } from "zod";

export class ProductValidation {
  static readonly GET: ZodType = z.string().min(3).max(100);
}
