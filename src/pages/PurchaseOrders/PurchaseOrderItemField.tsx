// components/OrderItemField.tsx
import { type UseFormReturn, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { type PurchaseOrderFormData } from "@/lib/zod/purchaseOrderSchema";

interface OrderItemFieldProps {
  control: UseFormReturn<PurchaseOrderFormData>["control"];
  index: number;
  remove: (index: number) => void;
  fieldsLength: number;
}

export function PurchaseOrderItemField({
  control,
  index,
  remove,
  fieldsLength,
}: OrderItemFieldProps) {
  return (
    <div className="space-y-2 p-3 border rounded-md relative">
      {fieldsLength > 1 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <Controller
        name={`items.${index}.product` as const}
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="Product ID"
            {...field}
            onChange={(e) => field.onChange(e.target.valueAsNumber)}
          />
        )}
      />

      <div className="grid grid-cols-3 gap-2">
        <Controller
          name={`items.${index}.quantity` as const}
          control={control}
          render={({ field }) => <Input placeholder="Qty" {...field} />}
        />
        <Controller
          name={`items.${index}.unit_price` as const}
          control={control}
          render={({ field }) => <Input placeholder="Unit Price" {...field} />}
        />
        <Controller
          name={`items.${index}.total_price` as const}
          control={control}
          render={({ field }) => (
            <Input
              placeholder="Total"
              {...field}
              readOnly
              className="bg-muted"
            />
          )}
        />
      </div>
    </div>
  );
}
