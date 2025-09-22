import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  loyality_points?: number;
  outstanding_balance?: number;
}

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomer: (id: string) => Promise<void>;
  createCustomer: (customerData: Omit<Customer, "id">) => Promise<void>;
  updateCustomer: (
    id: string,
    customerData: Partial<Customer>
  ) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  currentCustomer: null,
  isLoading: false,
  error: null,

  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Customer[]>(
        apiEndpoints.customers.get_all
      );
      set({ customers: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch customers";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCustomer: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Customer>(
        apiEndpoints.customers.get(id)
      );
      set({ currentCustomer: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch customer";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Customer>(
        apiEndpoints.customers.create,
        customerData
      );
      set((state) => ({
        customers: [...state.customers, response.data],
        currentCustomer: response.data,
      }));
      toast.success("Customer created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create customer";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<Customer>(
        apiEndpoints.customers.update(id),
        customerData
      );

      // Update customers list after updating
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? response.data : customer
        ),
        currentCustomer:
          state.currentCustomer?.id === id
            ? response.data
            : state.currentCustomer,
      }));

      toast.success("Customer updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update customer";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.customers.delete(id));

      // Update customers list after deletion
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        currentCustomer:
          state.currentCustomer?.id === id ? null : state.currentCustomer,
      }));

      toast.success("Customer deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete customer";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      customers: [],
      currentCustomer: null,
      isLoading: false,
      error: null,
    }),
}));
