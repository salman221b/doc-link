import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/Login";
import DashboardLayout from "./pages/AdminPanel";
import AdminDashboard from "./pages/Dashboard";

// Fake authentication function
const isAuthenticated = () => {
  return localStorage.getItem("adminAuth") === "true"; // Store auth state in localStorage
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/admin/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Dashboard Route */}
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
