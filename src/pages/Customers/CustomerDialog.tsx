import { useEffect } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCustomerStore, type Customer } from "@/stores/customerStore";
import {
  customerSchema,
  type CustomerFormData,
} from "@/lib/zod/customerSchema";

type DialogMode = "create" | "edit";

interface CustomerDialogProps {
  mode: DialogMode;
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CustomerDialog({
  mode,
  customer,
  open,
  onOpenChange,
  onSuccess,
}: CustomerDialogProps) {
  const { createCustomer, updateCustomer } = useCustomerStore();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as Resolver<CustomerFormData>,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      loyality_points: 0,
      outstanding_balance: 0,
    },
  });

  // Reset form when dialog opens or mode/customer changes
  useEffect(() => {
    if (mode === "edit" && customer) {
      form.reset(customer);
    } else {
      form.reset(); //rest to defaultValues
    }
  }, [open, mode, customer, form]);

  //   const isEdit = mode === "edit";

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (mode === "create") {
        await createCustomer(data);
      } else if (mode === "edit" && customer?.id) {
        await updateCustomer(customer.id, data);
      }
      onSuccess?.();
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
          <DialogTitle>
            {mode === "edit" ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the customer details below."
              : "Fill in the details to create a new customer."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone no." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Loyality Points */}
            <FormField
              control={form.control}
              name="loyality_points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loyality Points (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Amounts */}
            <FormField
              control={form.control}
              name="outstanding_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outstanding_balance</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
            <DialogFooter className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Customer"
                  : "Update Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
