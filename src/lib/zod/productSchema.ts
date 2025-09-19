import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
  sku: z.string().min(1, { message: "SKU is required" }),
  barcode: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  supplier: z.string().min(1, { message: "Supplier is required" }),
  purchase_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Must be >= 0" })
  ),
  selling_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Must be >= 0" })
  ),
  current_stock: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Must be >= 0" })
  ),
  minimum_stock: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Must be >= 0" })
  ),
  unit_of_measurement: z.string().min(1, { message: "Unit is required" }),
});

export type ProductFormData = z.infer<typeof productSchema>;
