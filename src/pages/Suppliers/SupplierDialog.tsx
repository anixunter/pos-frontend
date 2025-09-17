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
import { useSupplierStore } from "@/stores/supplierStore";
import type { Supplier } from "@/stores/supplierStore";
import { useEffect, useState } from "react";

type DialogMode = "create" | "edit";

interface SupplierDialogProps {
  mode: DialogMode;
  supplier: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SupplierDialog({
  mode,
  supplier,
  open,
  onOpenChange,
  onSuccess,
}: SupplierDialogProps) {
  const [name, setName] = useState("");
  const [contact_person, setContact_Person] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { createSupplier, updateSupplier } = useSupplierStore();

  // Reset form when dialog opens or mode/supplier changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && supplier) {
        setName(supplier.name);
        setContact_Person(supplier.contact_person);
        setPhone(supplier.phone);
        setEmail(supplier.email || "");
        setAddress(supplier.address);
      } else {
        // create mode — start fresh
        setName("");
        setContact_Person("");
        setPhone("");
        setEmail("");
        setAddress("");
      }
    }
  }, [open, mode, supplier]);

  const isEdit = mode === "edit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && supplier) {
        await updateSupplier(supplier.id, {
          name,
          contact_person,
          phone,
          email,
          address,
        });
      } else {
        await createSupplier({ name, contact_person, phone, email, address });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error(
        `Failed to ${isEdit ? "update" : "create"} supplier`,
        error
      );
      // optionally show toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the supplier details below."
              : "Fill in the details to create a new supplier."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            {/* Contact Person */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_person" className="text-right">
                Contact Person
              </Label>
              <Textarea
                id="contact_person"
                value={contact_person}
                onChange={(e) => setContact_Person(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* Phone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* Address */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3"
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
