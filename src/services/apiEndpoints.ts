const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiEndpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/token/`,
    refresh: `${API_BASE_URL}/auth/token/refresh/`,
  },
  users: {
    get: `${API_BASE_URL}/users/`,
    create: `${API_BASE_URL}/users/`,
    update: (id: string) => `${API_BASE_URL}/users/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/users/${id}/`,
    self: `${API_BASE_URL}/users/self/`,
  },
  customers: {
    get: `${API_BASE_URL}/customers/`,
    create: `${API_BASE_URL}/customers/`,
    update: (id: string) => `${API_BASE_URL}/customers/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/customers/${id}/`,
    purchase_history: (id: string) =>
      `${API_BASE_URL}/customers/${id}/purhcase_history/`,
    return_history: (id: string) =>
      `${API_BASE_URL}/customers/${id}/return_history/`,
    balance_summary: (id: string) =>
      `${API_BASE_URL}/customers/${id}/balance_summary/`,
    pay_credit: (id: string) => `${API_BASE_URL}/customers/${id}/pay_credit/`,
  },
  customers_deposit: {
    get: `${API_BASE_URL}/customers_deposit/`,
    create: `${API_BASE_URL}/customers_deposit/`,
    update: (id: string) => `${API_BASE_URL}/customers_deposit/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/customers_deposit/${id}/`,
  },
  categories: {
    get: `${API_BASE_URL}/categories/`,
    create: `${API_BASE_URL}/categories/`,
    update: (id: string) => `${API_BASE_URL}/categories/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/categories/${id}/`,
  },
  suppliers: {
    get: `${API_BASE_URL}/suppliers/`,
    create: `${API_BASE_URL}/suppliers/`,
    update: (id: string) => `${API_BASE_URL}/suppliers/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/suppliers/${id}/`,
  },
  products: {
    get: `${API_BASE_URL}/products/`,
    create: `${API_BASE_URL}/products/`,
    update: (id: string) => `${API_BASE_URL}/products/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/products/${id}/`,
    low_stocks: `${API_BASE_URL}/products/low_stocks/`,
    adjust_stock: (id: string) =>
      `${API_BASE_URL}/products/${id}/adjust_stock/`,
    price_history: (id: string) =>
      `${API_BASE_URL}/products/${id}/price_history/`,
  },
  inventory_adjustment: {
    get: `${API_BASE_URL}/inventory_adjustment/`,
    create: `${API_BASE_URL}/inventory_adjustment/`,
    update: (id: string) => `${API_BASE_URL}/inventory_adjustment/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/inventory_adjustment/${id}/`,
  },
  purhcase_orders: {
    get: `${API_BASE_URL}/purhcase_orders/`,
    create: `${API_BASE_URL}/purhcase_orders/`,
    update: (id: string) => `${API_BASE_URL}/purhcase_orders/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/purhcase_orders/${id}/`,
    complete: (id: string) => `${API_BASE_URL}/purhcase_orders/${id}/complete/`,
  },
  sales: {
    get: `${API_BASE_URL}/sales/`,
    create: `${API_BASE_URL}/sales/`,
    update: (id: string) => `${API_BASE_URL}/sales/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/sales/${id}/`,
  },
  returns: {
    get: `${API_BASE_URL}/returns/`,
    create: `${API_BASE_URL}/returns/`,
    update: (id: string) => `${API_BASE_URL}/returns/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/returns/${id}/`,
  },
};
