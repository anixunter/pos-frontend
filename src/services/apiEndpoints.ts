const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiEndpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/token/`,
    refresh: `${API_BASE_URL}/auth/token/refresh/`,
  },
  users: {
    get_all: `${API_BASE_URL}/users/`,
    get: (id: string) => `${API_BASE_URL}/users/${id}/`,
    create: `${API_BASE_URL}/users/`,
    update: (id: string) => `${API_BASE_URL}/users/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/users/${id}/`,
    self: `${API_BASE_URL}/users/self/`,
  },
  customers: {
    get_all: `${API_BASE_URL}/customers/`,
    get: (id: string) => `${API_BASE_URL}/customers/${id}/`,
    create: `${API_BASE_URL}/customers/`,
    update: (id: string) => `${API_BASE_URL}/customers/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/customers/${id}/`,
    purchase_history: (id: string) =>
      `${API_BASE_URL}/customers/${id}/purchase_history/`,
    return_history: (id: string) =>
      `${API_BASE_URL}/customers/${id}/return_history/`,
    balance_summary: (id: string) =>
      `${API_BASE_URL}/customers/${id}/balance_summary/`,
    pay_credit: (id: string) => `${API_BASE_URL}/customers/${id}/pay_credit/`,
  },
  customers_deposit: {
    get_all: `${API_BASE_URL}/customers_deposit/`,
    get: (id: string) => `${API_BASE_URL}/customers_deposit/${id}/`,
    create: `${API_BASE_URL}/customers_deposit/`,
    update: (id: string) => `${API_BASE_URL}/customers_deposit/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/customers_deposit/${id}/`,
  },
  categories: {
    get_all: `${API_BASE_URL}/categories/`,
    get: (id: string) => `${API_BASE_URL}/categories/${id}/`,
    create: `${API_BASE_URL}/categories/`,
    update: (id: string) => `${API_BASE_URL}/categories/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/categories/${id}/`,
  },
  suppliers: {
    get_all: `${API_BASE_URL}/suppliers/`,
    get: (id: string) => `${API_BASE_URL}/suppliers/${id}/`,
    create: `${API_BASE_URL}/suppliers/`,
    update: (id: string) => `${API_BASE_URL}/suppliers/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/suppliers/${id}/`,
  },
  products: {
    get_all: `${API_BASE_URL}/products/`,
    get: (id: string) => `${API_BASE_URL}/products/${id}/`,
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
    get_all: `${API_BASE_URL}/inventory_adjustment/`,
    get: (id: string) => `${API_BASE_URL}/inventory_adjustment/${id}/`,
    create: `${API_BASE_URL}/inventory_adjustment/`,
    update: (id: string) => `${API_BASE_URL}/inventory_adjustment/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/inventory_adjustment/${id}/`,
  },
  purchase_orders: {
    get_all: `${API_BASE_URL}/purchase_orders/`,
    get: (id: string) => `${API_BASE_URL}/purchase_orders/${id}/`,
    create: `${API_BASE_URL}/purchase_orders/`,
    update: (id: string) => `${API_BASE_URL}/purchase_orders/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/purchase_orders/${id}/`,
    complete: (id: string) => `${API_BASE_URL}/purchase_orders/${id}/complete/`,
  },
  sales: {
    get_all: `${API_BASE_URL}/sales/`,
    get: (id: string) => `${API_BASE_URL}/sales/${id}/`,
    create: `${API_BASE_URL}/sales/`,
    update: (id: string) => `${API_BASE_URL}/sales/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/sales/${id}/`,
  },
  returns: {
    get_all: `${API_BASE_URL}/returns/`,
    get: (id: string) => `${API_BASE_URL}/returns/${id}/`,
    create: `${API_BASE_URL}/returns/`,
    update: (id: string) => `${API_BASE_URL}/returns/${id}/`,
    delete: (id: string) => `${API_BASE_URL}/returns/${id}/`,
  },
};
