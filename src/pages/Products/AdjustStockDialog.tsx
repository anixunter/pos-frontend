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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useProductStore,
  type Product,
  type AdjustProduct,
} from "@/stores/productStore";
import { useEffect, useState } from "react";
import Select from "react-select";

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
  const [adjustment_type, setAdjustment_Type] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const { adjustProduct, fetchProducts } = useProductStore();

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (!open) {
      setAdjustment_Type("");
      setQuantity("");
      setReason("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const adjustData: AdjustProduct = {
        adjustment_type,
        quantity: Number(quantity),
        reason,
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adjustment_type">Adjustment Type</Label>
              <div className="col-span-3">
                <Select
                  id="adjustment_type"
                  options={adjustmentTypeOptions}
                  placeholder="Select adjustment type..."
                  isSearchable={false}
                  onChange={(option) => setAdjustment_Type(option?.value || "")}
                  value={
                    adjustmentTypeOptions.find(
                      (option) => option.value === adjustment_type
                    ) || null
                  }
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="col-span-3">
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
                placeholder="Enter reason for adjustment"
                required
              />
            </div>
          </div>
          <DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
}
