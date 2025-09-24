import { z } from "zod";

export const adjustStockSchema = z.object({
  adjustment_type: z.string().min(1, "Adjustment type is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Quantity must be a positive number"
    ),
  reason: z.string().min(1, { message: "Reason is required" }),
});

export type AdjustmentFormData = z.infer<typeof adjustStockSchema>;
