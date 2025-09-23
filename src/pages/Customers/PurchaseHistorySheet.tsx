import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

import { PurchaseHistoryCard } from "./PurchaseHistoryCard";
import { useCustomerStore, type Customer } from "@/stores/customerStore";

interface PurchaseHistorySheetProps {
  customer: Customer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseHistorySheet({
  customer,
  isOpen,
  onOpenChange,
}: PurchaseHistorySheetProps) {
  const { purchaseHistory, isPurchaseHistoryLoading } = useCustomerStore();
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl">Purchase History</SheetTitle>
          <SheetDescription>
            Transactions for{" "}
            <span className="font-semibold">{customer?.name}</span>
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          {isPurchaseHistoryLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading purchase history...</span>
            </div>
          ) : purchaseHistory?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No purchase history found for this customer.
            </div>
          ) : (
            <div className="space-y-6">
              {purchaseHistory?.map((txn) => (
                <PurchaseHistoryCard key={txn.id} transaction={txn} />
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
