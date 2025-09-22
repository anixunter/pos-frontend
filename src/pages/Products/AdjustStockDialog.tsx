import { useEffect } from "react";
import Select from "react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useProductStore,
  type Product,
  type AdjustProduct,
} from "@/stores/productStore";
import {
  inventoryAdjustmentSchema,
  type AdjustmentFormData,
} from "@/lib/zod/inventoryAdjustmentSchema";

interface AdjustStockDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define adjustment type options
const adjustmentTypeOptions = [
  { value: "Increase", label: "Increase" },
  { value: "Decrease", label: "Decrease" },
];

export function AdjustStockDialog({
  product,
  open,
  onOpenChange,
}: AdjustStockDialogProps) {
  const { adjustProduct, fetchProducts } = useProductStore();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<AdjustmentFormData>({
    resolver: zodResolver(inventoryAdjustmentSchema),
    defaultValues: {
      adjustment_type: "",
      quantity: "",
      reason: "",
    },
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: AdjustmentFormData) => {
    if (!product) return;

    try {
      const adjustData: AdjustProduct = {
        adjustment_type: data.adjustment_type,
        quantity: Number(data.quantity),
        reason: data.reason,
      };

      await adjustProduct(product.id, adjustData);
      // Close dialog on success
      onOpenChange(false);
      // Get fresh products data after inventory adjustment
      await fetchProducts();
    } catch (error) {
      // Error handling is done in the store, so we don't need to do anything here
      console.error("Error adjusting product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Adjust Inventory for {product?.name}</DialogTitle>
          <DialogDescription>
            Current Stock:{" "}
            <strong>
              {product?.current_stock} {product?.unit_of_measurement || ""}
            </strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="adjustment_type"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Adjustment Type</FormLabel>
                  <FormControl className="col-span-3">
                    <Select
                      options={adjustmentTypeOptions}
                      placeholder="Select adjustment type..."
                      isSearchable={false}
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={
                        adjustmentTypeOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      classNamePrefix="react-select"
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel>Reason</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea
                      placeholder="Enter reason for adjustment"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="col-start-2 col-span-3" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
