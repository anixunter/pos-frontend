import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
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
import { ProductDialog } from "./ProductDialog";
import { PriceHistoryDialog } from "./PriceHistoryDialog";
import { useProductStore, type Product } from "@/stores/productStore";

type DialogMode = "create" | "edit";

const getColumns = (
  handleEdit: (product: Product) => void,
  handlePriceHistory: (product: Product) => void,
  handleDelete: (product: Product) => void
): ColumnDef<Product>[] => [
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
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier",
  },
  {
    accessorKey: "purchase_price",
    header: "Purchase Price",
  },
  {
    accessorKey: "selling_price",
    header: "Selling Price",
  },
  {
    accessorKey: "current_stock",
    header: "Stock",
  },
  {
    accessorKey: "unit_of_measurement",
    header: "Unit",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(product)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriceHistory(product)}>
              Price History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(product)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Products = () => {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    deleteProduct,
    fetchPriceHistory,
    priceHistory,
  } = useProductStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPriceHistoryDialogOpen, setIsPriceHistoryDialogOpen] =
    useState(false);

  useEffect(() => {
    fetchProducts();
    return () => {
      // Optional: reset when component unmounts
      // Only do this if you want to clear product state when leaving the page
      useProductStore.getState().reset();
    };
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    // setEditingProduct(null)
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setDialogMode("edit");
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handlePriceHistory = (product: Product) => {
    setIsPriceHistoryDialogOpen(true);
    // fetch price history
    fetchPriceHistory(product.id);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id); // ← your store function
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  };

  const handleDialogSuccess = () => {
    setEditingProduct(null);
    // Optionally: refetch products if needed
    // fetchProducts()
  };

  const columns = getColumns(handleEdit, handlePriceHistory, handleDelete);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products Management</h2>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={products}
          onCreate={handleCreate}
          showFilter={true}
        />
        <ProductDialog
          key={
            isDialogOpen
              ? dialogMode === "edit"
                ? editingProduct?.id || "edit"
                : "create"
              : "closed"
          }
          mode={dialogMode}
          product={editingProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={handleDialogSuccess}
        />
        <PriceHistoryDialog
          priceHistory={priceHistory}
          open={isPriceHistoryDialogOpen}
          onOpenChange={setIsPriceHistoryDialogOpen}
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
                product{" "}
                <span className="font-medium">
                  &quot;{deletingProduct?.name}&quot;
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

export default Products;
