import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/user/Dashboard";
import Profile from "@/pages/user/Dashboard";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageUsers from "@/pages/admin/ManageUsers";

import AdminRoutes from "./AdminRoutes";
import Login from "@/pages/auth/Login";
import RegisterForm from "@/pages/auth/RegisterForm.tsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        // user Routes
        <Route
          path="/user/dashboard"
          element={
            <AdminRoutes>
              <Dashboard />
            </AdminRoutes>
          }
        />
        <Route path="/user/profile" element={<Profile />} />
        // admin Routes
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoutes adminOnly>
              <AdminDashboard />
            </AdminRoutes>
          }
        />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
