import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VendorProducts from "./pages/VendorProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderWaiting from "./pages/OrderWaiting";
import OrderStatus from "./pages/OrderStatus";
import OrderHistory from "./pages/OrderHistory";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/student-dashboard" element={<ProtectedRoute><RoleBasedRoute roles={["student"]}><StudentDashboard /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/vendor-dashboard" element={<ProtectedRoute><RoleBasedRoute roles={["vendor"]}><VendorDashboard /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><RoleBasedRoute roles={["admin"]}><AdminDashboard /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/vendor-products" element={<ProtectedRoute><RoleBasedRoute roles={["vendor"]}><VendorProducts /></RoleBasedRoute></ProtectedRoute>} />

          <Route path="/cart" element={<ProtectedRoute><RoleBasedRoute roles={["student"]}><Cart /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><RoleBasedRoute roles={["student"]}><Checkout /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/order-waiting/:orderId" element={<ProtectedRoute><RoleBasedRoute roles={["student"]}><OrderWaiting /></RoleBasedRoute></ProtectedRoute>} />
          <Route path="/order-status/:orderId" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><RoleBasedRoute roles={["student"]}><Subscription /></RoleBasedRoute></ProtectedRoute>} />

          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
