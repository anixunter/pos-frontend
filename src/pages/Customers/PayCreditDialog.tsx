import { useEffect, useState } from "react";
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
import { useCustomerStore, type Customer } from "@/stores/customerStore";

interface CustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayCreditDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDialogProps) {
  const { payCredit, fetchCustomers } = useCustomerStore();
  const [payment_amount, setPayment_Amount] = useState<string>("");

  // Reset form when dialog opens or customer changes
  useEffect(() => {
    if (open) {
      setPayment_Amount("");
    }
  }, [open, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    try {
      const paymentData = { payment_amount: Number(payment_amount) };
      await payCredit(customer.id, paymentData);

      onOpenChange(false);
      // Get fresh customers data after credit payment
      await fetchCustomers();
    } catch (error) {
      // whatever
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Pay Credit for {customer?.name}</DialogTitle>
          <DialogDescription>
            Total Due Amount {customer?.outstanding_balance}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment_amount" className="w-xl">
                Payment Amount
              </Label>
              <Input
                id="payment_amount"
                type="number"
                value={payment_amount}
                onChange={(e) => setPayment_Amount(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
