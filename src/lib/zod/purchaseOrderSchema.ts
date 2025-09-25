import { z } from "zod";

const orderItemSchema = z.object({
  product: z.number().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit_price: z.string().min(1, "Unit price is required"),
  received_quantity: z.string().optional(),
  total_price: z.string().optional(),
});

export const purchaseOrderSchema = z.object({
  supplier: z.number().min(1, "Supplier is required"),
  order_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date",
    })
    .optional(),
  status: z.enum(["Completed", "Pending"]).optional(),
  total_amount: z.string().optional(), // Can be auto-calculated
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;
