import { z } from "zod";

export const IdParamSchema = z
  .string()
  .transform((v) => Number.parseInt(v, 10))
  .refine((v) => Number.isFinite(v) && v > 0, "Invalid id");
