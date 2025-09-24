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

export interface PurchaseItem {
  id: string;
  product: number;
  product_name: string;
  quantity: string;
  unit_price: string;
  discount_amount: string;
  total_price: string;
}

export interface ReturnItem {
  id: string;
  product: number;
  product_name: string;
  quantity: string;
  unit_price: string;
  total_price: string;
}

export interface PurchaseReturn {
  id: string;
  transaction: number;
  return_date: string;
  reason: string;
  refund_amount: string;
  refund_method: string;
  notes: string;
  items: ReturnItem[];
}

export interface PurchaseTransaction {
  id: string;
  customer: number;
  customer_name: string;
  transaction_date: string;
  payment_method: string;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  amount_paid: string;
  change_amount: string;
  notes: string;
  items: PurchaseItem[];
  returns: PurchaseReturn[];
}

export type CustomerPurchaseHistory = PurchaseTransaction[];

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  purchaseHistory: CustomerPurchaseHistory | null;
  isPurchaseHistoryLoading: boolean;
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
  fetchPurchaseHistory: (id: string) => Promise<void>;
  payCredit: (id: string, paymentData: any) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  currentCustomer: null,
  purchaseHistory: null,
  isPurchaseHistoryLoading: false,
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

  fetchPurchaseHistory: async (id: string) => {
    set({ isPurchaseHistoryLoading: true, error: null });
    try {
      const response = await apiClient.get<CustomerPurchaseHistory>(
        apiEndpoints.customers.purchase_history(id)
      );
      set({ purchaseHistory: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch purchase history";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isPurchaseHistoryLoading: false });
    }
  },

  payCredit: async (id: string, paymentData: any) => {
    try {
      await apiClient.post(apiEndpoints.customers.pay_credit(id), paymentData);
      // update customers list after payment maybe?
      toast.success("Credit updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update credit";
      toast.error(errorMessage);
    } finally {
      // whatever
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      customers: [],
      currentCustomer: null,
      purchaseHistory: null,
      isPurchaseHistoryLoading: false,
      isLoading: false,
      error: null,
    }),
}));
