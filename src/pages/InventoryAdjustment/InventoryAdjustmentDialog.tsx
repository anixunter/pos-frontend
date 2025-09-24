import { useEffect } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  inventoryAdjustmentSchema,
  type InventoryAdjustmentFormData,
} from "@/lib/zod/inventoryAdjustmentSchema";
import { useInventoryAdjustmentStore } from "@/stores/inventoryAdjustmentStore";
import { useProductStore, type Product } from "@/stores/productStore";

interface InventoryAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define adjustment type options
const adjustmentTypeOptions = [
  { value: "Increase", label: "Increase" },
  { value: "Decrease", label: "Decrease" },
];

export function InventoryAdjustmentDialog({
  open,
  onOpenChange,
}: InventoryAdjustmentDialogProps) {
  const { createInventoryAdjustment } = useInventoryAdjustmentStore();
  const { products, fetchProducts } = useProductStore();

  const form = useForm<InventoryAdjustmentFormData>({
    resolver: zodResolver(inventoryAdjustmentSchema),
    defaultValues: {
      product: "",
      adjustment_type: "",
      quantity: "",
      reason: "",
    },
  });

  // Reset form when dialog opens or mode/inventoryAdjustment changes
  useEffect(() => {
    if (open) {
      // Only fetch if products are empty (not loaded yet)
      if (products.length === 0) {
        fetchProducts();
      }
      form.reset(); //rest to defaultValues
    }
  }, [open, form]);

  const productOptions = products.map((p: Product) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  const onSubmit = async (data: InventoryAdjustmentFormData) => {
    try {
      await createInventoryAdjustment(data);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Create Inventory Adjustment</DialogTitle>
          <DialogDescription>
            Fill in the details to create an inventory adjustment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Supplier */}
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      options={productOptions}
                      placeholder="Select a supplier..."
                      isSearchable
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={
                        productOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      classNamePrefix="react-select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Adjustment Type */}
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
            {/* Quantity */}
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
            {/* Reason */}
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
            {/* Footer */}
            <DialogFooter className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : "Create Inventory Adjustment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
