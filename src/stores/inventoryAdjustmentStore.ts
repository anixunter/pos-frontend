import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";

export interface InventoryAdjustment {
  id: string;
  product: string;
  product_name: string;
  adjustment_type: string;
  quantity: string;
  reason: string;
  adjustment_date: string;
  adjusted_by: string;
}

interface InventoryAdjustmentState {
  inventoryAdjustments: InventoryAdjustment[];
  currentInventoryAdjustment: InventoryAdjustment | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchInventoryAdjustments: () => Promise<void>;
  fetchInventoryAdjustment: (id: string) => Promise<void>;
  createInventoryAdjustment: (
    inventoryAdjustmentData: Partial<InventoryAdjustment>
  ) => Promise<void>;
  updateInventoryAdjustment: (
    id: string,
    inventoryAdjustmentData: Partial<InventoryAdjustment>
  ) => Promise<void>;
  deleteInventoryAdjustment: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useInventoryAdjustmentStore = create<InventoryAdjustmentState>(
  (set) => ({
    inventoryAdjustments: [],
    currentInventoryAdjustment: null,
    isLoading: false,
    error: null,

    fetchInventoryAdjustments: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get<InventoryAdjustment[]>(
          apiEndpoints.inventory_adjustment.get_all
        );
        set({ inventoryAdjustments: response.data });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          "Failed to fetch inventoryAdjustments";
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchInventoryAdjustment: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get<InventoryAdjustment>(
          apiEndpoints.inventory_adjustment.get(id)
        );
        set({ currentInventoryAdjustment: response.data });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail || "Failed to fetch inventoryAdjustment";
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    createInventoryAdjustment: async (inventoryAdjustmentData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.post<InventoryAdjustment>(
          apiEndpoints.inventory_adjustment.create,
          inventoryAdjustmentData
        );
        set((state) => ({
          inventoryAdjustments: [...state.inventoryAdjustments, response.data],
          currentInventoryAdjustment: response.data,
        }));
        toast.success("InventoryAdjustment created successfully!");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          "Failed to create inventoryAdjustment";
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    updateInventoryAdjustment: async (id, inventoryAdjustmentData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.patch<InventoryAdjustment>(
          apiEndpoints.inventory_adjustment.update(id),
          inventoryAdjustmentData
        );

        // Update inventoryAdjustments list after updating
        set((state) => ({
          inventoryAdjustments: state.inventoryAdjustments.map(
            (inventoryAdjustment) =>
              inventoryAdjustment.id === id
                ? response.data
                : inventoryAdjustment
          ),
          currentInventoryAdjustment:
            state.currentInventoryAdjustment?.id === id
              ? response.data
              : state.currentInventoryAdjustment,
        }));

        toast.success("InventoryAdjustment updated successfully!");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          "Failed to update inventoryAdjustment";
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    deleteInventoryAdjustment: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.delete(apiEndpoints.inventory_adjustment.delete(id));

        // Update inventoryAdjustments list after deletion
        set((state) => ({
          inventoryAdjustments: state.inventoryAdjustments.filter(
            (inventoryAdjustment) => inventoryAdjustment.id !== id
          ),
          currentInventoryAdjustment:
            state.currentInventoryAdjustment?.id === id
              ? null
              : state.currentInventoryAdjustment,
        }));

        toast.success("InventoryAdjustment deleted successfully!");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          "Failed to delete inventoryAdjustment";
        set({ error: errorMessage });
        toast.error(errorMessage);
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  })
);
