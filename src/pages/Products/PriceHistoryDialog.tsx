import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  type ProductPriceHistory,
  type PriceHistoryEntry,
} from "@/stores/productStore";

interface PriceHistoryDialogProps {
  priceHistory: ProductPriceHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const columns: ColumnDef<PriceHistoryEntry>[] = [
  {
    accessorKey: "purchase_price",
    header: "Purchase Price",
  },
  {
    accessorKey: "effective_date",
    header: "Effective Date",
  },
  {
    accessorKey: "purchase_order",
    header: "Purchase Order Id",
  },
  {
    accessorKey: "quantity_received",
    header: "Received Quantity",
  },
];

export function PriceHistoryDialog({
  priceHistory,
  open,
  onOpenChange,
}: PriceHistoryDialogProps) {
  const data = priceHistory?.price_history || [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[80vw]! max-w-4xl!"
      >
        <DialogHeader>
          <DialogTitle>
            Price History for {priceHistory?.product_name}
          </DialogTitle>
          <DialogDescription>
            Current Purchase Price:{" "}
            <strong>${priceHistory?.current_purchase_price.toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>
        <DataTable columns={columns} data={data} />
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
