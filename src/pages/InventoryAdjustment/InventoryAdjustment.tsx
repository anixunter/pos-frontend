import type { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import {
  useInventoryAdjustmentStore,
  type InventoryAdjustment,
} from "@/stores/inventoryAdjustmentStore";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InventoryAdjustmentDialog } from "./InventoryAdjustmentDialog";

const getColumns = (
  handleDelete: (inventoryAdjustment: InventoryAdjustment) => void
): ColumnDef<InventoryAdjustment>[] => [
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    meta: {
      filterable: true,
      filterLabel: "Product Name",
    },
  },
  {
    accessorKey: "adjustment_type",
    header: "Type",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "adjustment_date",
    header: "Date",
  },
  {
    accessorKey: "adjusted_by",
    header: "Adjusted By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const inventoryAdjustment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleDelete(inventoryAdjustment)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const InventoryAdjustments = () => {
  const { inventoryAdjustments, error, fetchInventoryAdjustments } =
    useInventoryAdjustmentStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingInventoryAdjustment, setDeletingInventoryAdjustment] =
    useState<InventoryAdjustment | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchInventoryAdjustments();
  }, []);

  const handleCreate = () => {
    // setEditingInventoryAdjustment(null)
    setIsDialogOpen(true);
  };

  const handleDelete = (inventoryAdjustment: InventoryAdjustment) => {
    setDeletingInventoryAdjustment(inventoryAdjustment);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingInventoryAdjustment) return;

    try {
      // await deleteInventoryAdjustment(deletingInventoryAdjustment.id);
      // inventory adjustment shouldn't be deleted
    } catch (error) {
      console.error("Failed to delete inventoryAdjustment", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingInventoryAdjustment(null);
    }
  };

  const columns = getColumns(handleDelete);

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">InventoryAdjustments</h2>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={inventoryAdjustments}
          onCreate={handleCreate}
          showFilter={true}
        />
        <InventoryAdjustmentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default InventoryAdjustments;
