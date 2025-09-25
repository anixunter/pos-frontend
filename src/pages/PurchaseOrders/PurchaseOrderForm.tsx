// components/PurchaseOrderForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray } from "react-hook-form";
import {
  purchaseOrderSchema,
  type PurchaseOrderFormData,
} from "@/lib/zod/purchaseOrderSchema";
import { PurchaseOrderItemField } from "./PurchaseOrderItemField";
import { type PurchaseOrder } from "@/stores/purchaseOrderStore";

interface PurchaseOrderFormProps {
  initialData?: PurchaseOrder;
  onSubmit: (data: PurchaseOrderFormData) => void;
}

export function PurchaseOrderForm({
  initialData,
  onSubmit,
}: PurchaseOrderFormProps) {
  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplier: initialData?.supplier || 0,
      order_date:
        initialData?.order_date || new Date().toISOString().split("T")[0],
      status: initialData?.status || "Pending",
      notes: initialData?.notes || "",
      items: initialData?.items?.map((item) => ({
        ...item,
        product: Number(item.product),
        quantity: String(item.quantity),
        unit_price: String(item.unit_price),
        received_quantity: String(item.received_quantity || "0"),
      })) || [
        {
          product: 0,
          quantity: "1",
          unit_price: "0",
          received_quantity: "0",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Auto-calculate totals
  const items = form.watch("items");
  useEffect(() => {
    items.forEach((item, index) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      const total = (qty * price).toFixed(2);
      form.setValue(`items.${index}.total_price` as any, total, {
        shouldValidate: false,
      });
    });

    const totalAmount = items
      .reduce((sum, item) => {
        return sum + (parseFloat(item.total_price || "0") || 0);
      }, 0)
      .toFixed(2);
    form.setValue("total_amount", totalAmount, { shouldValidate: false });
  }, [items, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Supplier */}
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier ID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="order_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Items Section */}
        <div className="space-y-4">
          <FormLabel>Order Items</FormLabel>
          {fields.map((field, index) => (
            <PurchaseOrderItemField
              key={field.id}
              control={form.control}
              index={index}
              remove={remove}
              fieldsLength={fields.length}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                product: 0,
                quantity: "1",
                unit_price: "0",
                received_quantity: "0",
              })
            }
          >
            + Add Item
          </Button>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Purchase Order"}
        </Button>
      </form>
    </Form>
  );
}
