import type { ColumnDef } from "@tanstack/react-table"
import { useEffect } from "react"
import { useCategoryStore } from "@/stores/categoryStore";

export type Category = {
  id: string;
  name: string;
  description: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
]

const Categories = () => {
  const {categories, isLoading, error, fetchCategories } = useCategoryStore();

  useEffect(()=>{
    fetchCategories();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Categories Management</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong> - {category.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;