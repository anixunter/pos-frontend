import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";

export interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  createCategory: (categoryData: Omit<Category, "id">) => Promise<void>;
  updateCategory: (
    id: string,
    categoryData: Partial<Category>
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Category[]>(
        apiEndpoints.categories.get_all
      );
      set({ categories: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch categories";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Category>(
        apiEndpoints.categories.get(id)
      );
      set({ currentCategory: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch category";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Category>(
        apiEndpoints.categories.create,
        categoryData
      );
      set((state) => ({
        categories: [...state.categories, response.data],
        currentCategory: response.data,
      }));
      toast.success("Category created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create category";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<Category>(
        apiEndpoints.categories.update(id),
        categoryData
      );

      // Update categories list after updating
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? response.data : category
        ),
        currentCategory:
          state.currentCategory?.id === id
            ? response.data
            : state.currentCategory,
      }));

      toast.success("Category updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update category";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.categories.delete(id));

      // Update categories list after deletion
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        currentCategory:
          state.currentCategory?.id === id ? null : state.currentCategory,
      }));

      toast.success("Category deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete category";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
