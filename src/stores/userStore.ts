import { create } from "zustand";
import apiClient from "@/services/apiClient";
import { apiEndpoints } from "@/services/apiEndpoints";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./authStore";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  createUser: (userData: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<User[]>(apiEndpoints.users.get_all);
      set({ users: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch users";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<User>(apiEndpoints.users.get(id));
      set({ currentUser: response.data });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to fetch user";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<User>(
        apiEndpoints.users.create,
        userData
      );
      set((state) => ({
        users: [...state.users, response.data],
        currentUser: response.data,
      }));
      toast.success("User created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to create user";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch<User>(apiEndpoints.users.update(id), userData);

      // Update users list
      //   set((state) => ({
      //     users: state.users.map((user) =>
      //       user.id === id ? response.data : user
      //     ),
      //     currentUser:
      //       state.currentUser?.id === id ? response.data : state.currentUser,
      //   }));

      // Update auth store if updating current user
      //   const authUser = useAuthStore.getState().user;
      //   if (authUser?.id === id) {
      //     useAuthStore.getState().setUser(response.data);
      //   }

      toast.success("User updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to update user";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(apiEndpoints.users.delete(id));

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser,
      }));

      // Logout if deleting current user
      const authUser = useAuthStore.getState().user;
      if (authUser?.id === id) {
        useAuthStore.getState().logout();
      }

      toast.success("User deleted successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete user";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
