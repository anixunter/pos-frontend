import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minutes
      retry: (failureCount, error) => {
        // dont retry on 404 errors
        if (error.response?.status === 404) return false;
        return failureCount < 3;
      },
    },
  },
});
