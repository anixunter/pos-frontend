import type { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useCustomerStore, type Customer } from "@/stores/customerStore";
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
import { CustomerDialog } from "./CustomerDialog";
import { PurchaseHistorySheet } from "./PurchaseHistorySheet";

type DialogMode = "create" | "edit";

const getColumns = (
  handleEdit: (customer: Customer) => void,
  handlePurchaseHistory: (customer: Customer) => void,
  handleDelete: (customer: Customer) => void
): ColumnDef<Customer>[] => [
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
    meta: {
      filterable: true,
      filterLabel: "Customer Name",
    },
  },
  {
    accessorKey: "phone",
    header: "Phone No.",
    meta: {
      filterable: true,
      filterLabel: "Phone Number",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
    meta: {
      filterable: true,
    },
  },
  {
    accessorKey: "loyality_points",
    header: "Loyality Points",
  },
  {
    accessorKey: "outstanding_balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(customer)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePurchaseHistory(customer)}>
              Purchase History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(customer)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Customers = () => {
  const {
    customers,
    isLoading,
    error,
    fetchCustomers,
    deleteCustomer,
    fetchPurchaseHistory,
  } = useCustomerStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchaseHistoryCustomer, setSelectedPurchaseHistoryCustomer] =
    useState<Customer | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    return () => {
      // Optional: reset when component unmounts
      // Only do this if you want to clear customer state when leaving the page
      useCustomerStore.getState().reset();
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    // setEditingCustomer(null)
    setIsDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setDialogMode("edit");
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handlePurchaseHistory = (customer: Customer) => {
    setSelectedPurchaseHistoryCustomer(customer);
    setIsSheetOpen(true);
    fetchPurchaseHistory(customer.id);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingCustomer) return;

    try {
      await deleteCustomer(deletingCustomer.id); // ← your store function
    } catch (error) {
      console.error("Failed to delete customer", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCustomer(null);
    }
  };

  const handleDialogSuccess = () => {
    setEditingCustomer(null);
    // Optionally: refetch customers if needed
    // fetchCustomers()
  };

  const columns = getColumns(handleEdit, handlePurchaseHistory, handleDelete);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Customers Management</h2>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={customers}
          onCreate={handleCreate}
          showFilter={true}
          defaultColumnVisibility={{ email: false, loyality_points: false }}
        />
        <CustomerDialog
          key={
            isDialogOpen
              ? dialogMode === "edit"
                ? editingCustomer?.id || "edit"
                : "create"
              : "closed"
          }
          mode={dialogMode}
          customer={editingCustomer}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        <PurchaseHistorySheet
          customer={selectedPurchaseHistoryCustomer}
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
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
                customer{" "}
                <span className="font-medium">
                  &quot;{deletingCustomer?.name}&quot;
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

export default Customers;
