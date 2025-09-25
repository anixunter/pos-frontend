import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Login";
import Sales from "@/pages/Sales";
import Returns from "@/pages/Returns";
import Customers from "@/pages/Customers/Customers";
import Deposits from "@/pages/Deposits";
import InventoryAdjustment from "@/pages/InventoryAdjustment/InventoryAdjustment";
import PurchaseOrders from "@/pages/PurchaseOrders/PurchaseOrders";
import Products from "@/pages/Products/Products";
import Suppliers from "@/pages/Suppliers/Suppliers";
import Categories from "@/pages/Categories/Categories";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/sales" element={<Sales />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/deposits" element={<Deposits />} />
            <Route
              path="/inventory-adjustment"
              element={<InventoryAdjustment />}
            />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/categories" element={<Categories />} />

            {/* Redirect root to sales page */}
            <Route path="/" element={<Navigate to="/sales" replace />} />
          </Route>
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
