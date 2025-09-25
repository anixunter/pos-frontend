import { type PurchaseOrder } from "@/stores/purchaseOrderStore";

type DialogMode = "create" | "edit";

interface PurchaseOrderDialogProps {
  mode: DialogMode;
  purchaseOrder: PurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PurchaseOrderDialog({
  mode,
  purchaseOrder,
  open,
  onOpenChange,
}: PurchaseOrderDialogProps) {
  console.log(mode, purchaseOrder, open, onOpenChange);
  return (
    <>
      <div>Test</div>
    </>
  );
}
