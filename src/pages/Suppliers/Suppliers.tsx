import type { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useSupplierStore } from "@/stores/supplierStore";
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
import { SupplierDialog } from "./SupplierDialog";
import type { Supplier } from "@/stores/supplierStore";

type DialogMode = "create" | "edit";

const getColumns = (
  handleEdit: (supplier: Supplier) => void,
  handleDelete: (supplier: Supplier) => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "name",
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
  },
  {
    accessorKey: "contact_person",
    header: "Contact Person",
  },
  {
    accessorKey: "phone",
    header: "Phone No.",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(supplier)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(supplier)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Suppliers = () => {
  const { suppliers, isLoading, error, fetchSuppliers, deleteSupplier } =
    useSupplierStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    // setEditingSupplier(null)
    setIsDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setDialogMode("edit");
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingSupplier) return;

    try {
      await deleteSupplier(deletingSupplier.id); // ← your store function
      // Optionally show toast
      // toast({ title: "Supplier deleted", description: `${deletingSupplier.name} has been removed.` })
    } catch (error) {
      console.error("Failed to delete supplier", error);
      // toast({ title: "Error", description: "Failed to delete supplier.", variant: "destructive" })
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSupplier(null);
    }
  };

  const handleDialogSuccess = () => {
    setEditingSupplier(null);
    // Optionally: refetch suppliers if needed
    // fetchSuppliers()
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Suppliers Management</h2>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={suppliers} onCreate={handleCreate} />
        <SupplierDialog
          key={
            isDialogOpen
              ? dialogMode === "edit"
                ? editingSupplier?.id || "edit"
                : "create"
              : "closed"
          }
          mode={dialogMode}
          supplier={editingSupplier}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                supplier{" "}
                <span className="font-medium">
                  &quot;{deletingSupplier?.name}&quot;
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

export default Suppliers;
