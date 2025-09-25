import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
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
import { PurchaseOrderDialog } from "./PurchaseOrderDialog";
import {
  usePurchaseOrderStore,
  type PurchaseOrder,
} from "@/stores/purchaseOrderStore";
import { PurchaseOrderForm } from "./PurchaseOrderForm";

type DialogMode = "create" | "edit";

const getColumns = (
  handleEdit: (purchaseOrder: PurchaseOrder) => void,
  handleDelete: (purchaseOrder: PurchaseOrder) => void
): ColumnDef<PurchaseOrder>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier",
  },
  {
    accessorKey: "order_date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
  },
  {
    accessorKey: "notes",
    header: "Note",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const purchaseOrder = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(purchaseOrder)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(purchaseOrder)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PurchaseOrders = () => {
  const {
    purchaseOrders,
    isLoading,
    error,
    fetchPurchaseOrders,
    deletePurchaseOrder,
  } = usePurchaseOrderStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const [editingPurchaseOrder, setEditingPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingPurchaseOrder, setDeletingPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchPurchaseOrders();
    return () => {
      // Optional: reset when component unmounts
      // Only do this if you want to clear purchaseOrder state when leaving the page
      usePurchaseOrderStore.getState().reset();
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    // setEditingPurchaseOrder(null)
    setIsDialogOpen(true);
  };

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    setDialogMode("edit");
    setEditingPurchaseOrder(purchaseOrder);
    setIsDialogOpen(true);
  };

  const handleDelete = (purchaseOrder: PurchaseOrder) => {
    setDeletingPurchaseOrder(purchaseOrder);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingPurchaseOrder) return;

    try {
      //   await deletePurchaseOrder(deletingPurchaseOrder.id);
    } catch (error) {
      console.error("Failed to delete purchaseOrder", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingPurchaseOrder(null);
    }
  };

  const handleDialogSuccess = () => {
    setEditingPurchaseOrder(null);
    // Optionally: refetch purchaseOrders if needed
    // fetchPurchaseOrders()
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">PurchaseOrders Management</h2>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={purchaseOrders}
          onCreate={handleCreate}
        />
        <PurchaseOrderForm onSubmit={() => {}} />
        {/* <PurchaseOrderDialog
          key={
            isDialogOpen
              ? dialogMode === "edit"
                ? editingPurchaseOrder?.id || "edit"
                : "create"
              : "closed"
          }
          mode={dialogMode}
          purchaseOrder={editingPurchaseOrder}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        /> */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                purchaseOrder{" "}
                <span className="font-medium">
                  &quot;{deletingPurchaseOrder?.id}&quot;
                </span>{" "}
                and remove all associated data.
              </AlertDialogDescription>
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

export default PurchaseOrders;
