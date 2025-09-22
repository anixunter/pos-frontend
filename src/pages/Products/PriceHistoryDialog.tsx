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
import { type PriceHistoryEntry, useProductStore } from "@/stores/productStore";

interface PriceHistoryDialogProps {
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("effective_date"));
      return date.toLocaleString();
    },
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
  open,
  onOpenChange,
}: PriceHistoryDialogProps) {
  const { priceHistory, isPriceHistoryLoading } = useProductStore();
  const data = priceHistory?.price_history || [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Price History for {priceHistory?.product_name}
          </DialogTitle>
          <DialogDescription>
            Current Purchase Price:{" "}
            <strong>${priceHistory?.current_purchase_price.toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>
        {isPriceHistoryLoading ? (
          <div className="flex justify-center py-4">Loading...</div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
