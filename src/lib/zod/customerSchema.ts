import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, { message: "Customer name is required" }),
  phone: z.string().min(1, { message: "Phone no. is required" }),
  email: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  loyality_points: z.preprocess(
    (val) => (val === undefined || val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Must be >= 0" }).optional()
  ),
  outstanding_balance: z.preprocess(
    (val) => (val === undefined || val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Must be >= 0" }).optional()
  ),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
