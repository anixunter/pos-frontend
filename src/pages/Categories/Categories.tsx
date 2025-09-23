import type { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useCategoryStore, type Category } from "@/stores/categoryStore";
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
import { CategoryDialog } from "./CategoryDialog";

type DialogMode = "create" | "edit";

const getColumns = (
  handleEdit: (category: Category) => void,
  handleDelete: (category: Category) => void
): ColumnDef<Category>[] => [
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
      filterLabel: "Category Name",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(category)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(category)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Categories = () => {
  const { categories, isLoading, error, fetchCategories, deleteCategory } =
    useCategoryStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setDialogMode("create");
    // setEditingCategory(null)
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setDialogMode("edit");
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id); // ← your store function
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    }
  };

  const handleDialogSuccess = () => {
    setEditingCategory(null);
    // Optionally: refetch categories if needed
    // fetchCategories()
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Categories Management</h2>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={categories}
          onCreate={handleCreate}
          showFilter={true}
        />
        <CategoryDialog
          key={
            isDialogOpen
              ? dialogMode === "edit"
                ? editingCategory?.id || "edit"
                : "create"
              : "closed"
          }
          mode={dialogMode}
          category={editingCategory}
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
                category{" "}
                <span className="font-medium">
                  &quot;{deletingCategory?.name}&quot;
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

export default Categories;
