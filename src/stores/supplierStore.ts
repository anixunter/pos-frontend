import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
}

interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSuppliers: () => Promise<void>;
  fetchSupplier: (id: string) => Promise<void>;
  createSupplier: (supplierData: Omit<Supplier, "id">) => Promise<void>;
  updateSupplier: (
    id: string,
    supplierData: Partial<Supplier>
  ) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  error: null,

  fetchSuppliers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Supplier[]>(
        apiEndpoints.suppliers.get_all
      );
      set({ suppliers: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch suppliers";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSupplier: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Supplier>(
        apiEndpoints.suppliers.get(id)
      );
      set({ currentSupplier: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch supplier";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createSupplier: async (supplierData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Supplier>(
        apiEndpoints.suppliers.create,
        supplierData
      );
      set((state) => ({
        suppliers: [...state.suppliers, response.data],
        currentSupplier: response.data,
      }));
      toast.success("Supplier created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create supplier";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSupplier: async (id, supplierData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<Supplier>(
        apiEndpoints.suppliers.update(id),
        supplierData
      );

      // Update suppliers list after updating
      set((state) => ({
        suppliers: state.suppliers.map((supplier) =>
          supplier.id === id ? response.data : supplier
        ),
        currentSupplier:
          state.currentSupplier?.id === id
            ? response.data
            : state.currentSupplier,
      }));

      toast.success("Supplier updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update supplier";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSupplier: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.suppliers.delete(id));

      // Update suppliers list after deletion
      set((state) => ({
        suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
        currentSupplier:
          state.currentSupplier?.id === id ? null : state.currentSupplier,
      }));

      toast.success("Supplier deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete supplier";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
