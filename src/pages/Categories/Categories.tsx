import type { ColumnDef } from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useCategoryStore } from "@/stores/categoryStore";
import { DataTable } from "@/components/ui/data-table";
import { MoreHorizontal, ArrowUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CategoryDialog } from "./CategoryDialog";

export type Category = {
  id: string;
  name: string;
  description: string;
}

type DialogMode = "create" | "edit"

const getColumns = (handleEdit: (category: Category)=> void): ColumnDef<Category>[] => [
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
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(category.id)}>Copy Id</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>handleEdit(category)}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const Categories = () => {
  const {categories, isLoading, error, fetchCategories } = useCategoryStore();

  const [dialogMode, setDialogMode] = useState<DialogMode>("edit")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(()=>{
    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setDialogMode("edit")
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setDialogMode("create")
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const handleDialogSuccess = () => {
    setEditingCategory(null)
    // Optionally: refetch categories if needed
    // fetchCategories()
  }

  const columns = getColumns(handleEdit)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Categories Management</h2>
      <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={categories} />
        <CategoryDialog
        key={dialogMode === "edit" ? editingCategory?.id : "new"} // 👈 forces remount on mode/category change
        mode={dialogMode}
        category={editingCategory}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleDialogSuccess}
      />
      </div>
    </div>
  );
};

export default Categories;