import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";
import { type PurchaseOrderFormData } from "@/lib/zod/purchaseOrderSchema";

export interface OrderItem {
  id: string;
  product: number;
  product_name: string;
  quantity: string;
  unit_price: string;
  received_quantity: string;
  total_price: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: number;
  supplier_name: string;
  order_date: string;
  status: "Completed" | "Pending";
  total_amount: string;
  notes: string;
  items: OrderItem[];
}

interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPurchaseOrders: () => Promise<void>;
  fetchPurchaseOrder: (id: string) => Promise<void>;
  createPurchaseOrder: (
    purchaseOrderData: PurchaseOrderFormData
  ) => Promise<void>;
  updatePurchaseOrder: (
    id: string,
    purchaseOrderData: Partial<PurchaseOrder>
  ) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePurchaseOrderStore = create<PurchaseOrderState>((set) => ({
  purchaseOrders: [],
  currentPurchaseOrder: null,
  priceHistory: null,
  isLoading: false,
  isPriceHistoryLoading: false,
  error: null,

  fetchPurchaseOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<PurchaseOrder[]>(
        apiEndpoints.purchase_orders.get_all
      );
      set({ purchaseOrders: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch purchaseOrders";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPurchaseOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<PurchaseOrder>(
        apiEndpoints.purchase_orders.get(id)
      );
      set({ currentPurchaseOrder: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch purchaseOrder";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createPurchaseOrder: async (purchaseOrderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<PurchaseOrder>(
        apiEndpoints.purchase_orders.create,
        purchaseOrderData
      );
      set((state) => ({
        purchaseOrders: [...state.purchaseOrders, response.data],
        currentPurchaseOrder: response.data,
      }));
      toast.success("PurchaseOrder created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create purchaseOrder";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePurchaseOrder: async (id, purchaseOrderData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<PurchaseOrder>(
        apiEndpoints.purchase_orders.update(id),
        purchaseOrderData
      );

      // Update purchaseOrders list after updating
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map((purchaseOrder) =>
          purchaseOrder.id === id ? response.data : purchaseOrder
        ),
        currentPurchaseOrder:
          state.currentPurchaseOrder?.id === id
            ? response.data
            : state.currentPurchaseOrder,
      }));

      toast.success("PurchaseOrder updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update purchaseOrder";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePurchaseOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.purchase_orders.delete(id));

      // Update purchaseOrders list after deletion
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter(
          (purchaseOrder) => purchaseOrder.id !== id
        ),
        currentPurchaseOrder:
          state.currentPurchaseOrder?.id === id
            ? null
            : state.currentPurchaseOrder,
      }));

      toast.success("PurchaseOrder deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete purchaseOrder";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      purchaseOrders: [],
      currentPurchaseOrder: null,
      isLoading: false,
      error: null,
    }),
}));
