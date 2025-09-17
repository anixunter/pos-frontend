import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";
import { type ProductFormData } from "@/lib/zod/productSchema";

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  barcode: string;
  category: string;
  category_name: string;
  supplier: string;
  supplier_name: string;
  purchase_price: number;
  selling_price: number;
  current_stock: number;
  minimum_stock: number;
  unit_of_measurement: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (productData: ProductFormData) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Product[]>(
        apiEndpoints.products.get_all
      );
      set({ products: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch products";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Product>(
        apiEndpoints.products.get(id)
      );
      set({ currentProduct: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch product";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Product>(
        apiEndpoints.products.create,
        productData
      );
      set((state) => ({
        products: [...state.products, response.data],
        currentProduct: response.data,
      }));
      toast.success("Product created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create product";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<Product>(
        apiEndpoints.products.update(id),
        productData
      );

      // Update products list after updating
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? response.data : product
        ),
        currentProduct:
          state.currentProduct?.id === id
            ? response.data
            : state.currentProduct,
      }));

      toast.success("Product updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update product";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.products.delete(id));

      // Update products list after deletion
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        currentProduct:
          state.currentProduct?.id === id ? null : state.currentProduct,
      }));

      toast.success("Product deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete product";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
